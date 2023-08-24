import * as R from 'remeda';
import * as React from 'react';
import ReactDOM from 'react-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl, { GeoJSONSourceRaw } from 'mapbox-gl';
import GeoJSON from 'geojson';
import coordinate from '../../../portal_configs.json';
import type { Dataframe, DataframeRow, Field } from './types';

type Props = {
  dataframe: Dataframe;
};

function PointTooltip({
  dataRow,
  fields,
}: {
  dataRow: DataframeRow;
  fields: readonly Field[];
}): JSX.Element {
  const fieldsMap = new Map(fields.map(field => [field.id, field]));
  return (
    <div
      style={{
        height: 396,
        margin: '-10px -10px',
      }}
      className="overflow-auto p-2 px-3"
    >
      <dl className="space-y-1">
        {R.pipe(
          dataRow,
          R.keys,
          R.sortBy([key => key, 'asc']),
          R.map(fieldId => (
            <div key={fieldId} className="flex justify-between space-x-4">
              <dt>{fieldsMap.get(fieldId)?.displayName ?? fieldId}</dt>
              <dd>{dataRow[fieldId] ?? 'null'}</dd>
            </div>
          )),
        )}
      </dl>
    </div>
  );
}

const LATITUDE_FIELD_POSSIBILITIES = ['latitude', 'lat', 'y'];
const LONGITUDE_FIELD_POSSIBILITIES = ['longitude', 'long', 'x'];

export function MapViz({ dataframe }: Props): JSX.Element {
  const { data, fields, city} = dataframe;
  const mapRef = React.useRef<mapboxgl.Map | null>(null);
  const tooltipRef = React.useRef(
    new mapboxgl.Popup({
      offset: 15,
      maxWidth: '400px',
      closeButton: false,
    }),
  );

  const [latField, longField] = React.useMemo(() => {
    // first, keep only fields that are text or number.
    const possibleFields = fields.filter(
      field => field.type === 'text' || field.type === 'number',
    );

    // find latitude field
    const lat = possibleFields.find(field =>
      LATITUDE_FIELD_POSSIBILITIES.some(
        possibleId => possibleId === field.id.toLowerCase(),
      ),
    );

    // find longitude field
    const lng = possibleFields.find(field =>
      LONGITUDE_FIELD_POSSIBILITIES.some(
        possibleId => possibleId === field.id.toLowerCase(),
      ),
    );
    return [lat, lng];
  }, [fields]);

  const geojson: GeoJSONSourceRaw = React.useMemo(() => {
    if (latField && longField) {
      return {
        type: 'geojson',
        data: GeoJSON.parse(data, { Point: [latField.id, longField.id] }),
      };
    }

    // we couldn't find a lat/long field so return an empty geojson
    return {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
    };
  }, [data, latField, longField]);

  // set up the map
  React.useEffect(() => {
    if (!mapRef.current) {
      const map = new mapboxgl.Map({
        accessToken: process.env.REACT_APP_SCOUT_MAPBOX_API_KEY ?? '',
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v11',
        center: city in coordinate ? coordinate[city as keyof typeof coordinate].coordinate as [number, number] : [0, 0],
        zoom: city in coordinate ? 10: 2,
        bearing: 0,
        pitch: 0,
        pitchWithRotate: false,
      });
      mapRef.current = map;

      map.on('load', () => {
        // add the points as a GeoJSON source
        map.addSource('points', geojson);

        // add a circle layer
        map.addLayer({
          id: 'point',
          type: 'circle',
          source: 'points',
          paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff',
          },
        });

        // display a tooltip on point click
        map.on('click', 'point', e => {
          const tooltipNode = document.createElement('div');
          const { features, lngLat } = e;
          if (features && features[0]) {
            const { properties } = features[0];
            if (properties) {
              ReactDOM.render(
                <PointTooltip dataRow={properties} fields={fields} />,
                tooltipNode,
              );

              tooltipRef.current
                .setLngLat(lngLat)
                .setDOMContent(tooltipNode)
                .addTo(map);
            }
          }
        });

        map.on('mouseenter', 'point', () => {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'point', () => {
          map.getCanvas().style.cursor = '';
        });
      });
    }
  }, [geojson, fields, city]);

  return (
    <>
      {latField === undefined || longField === undefined ? (
        <p className="text-red-700 text-base">
          No points could be mapped because we could not find a latitude or
          longitude column for this dataset.
        </p>
      ) : null}
      <div id="map" className="h-96 w-full sm:h-[90%]" />;
    </>
  );
}
