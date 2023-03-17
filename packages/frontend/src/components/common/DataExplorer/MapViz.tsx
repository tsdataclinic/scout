import * as R from 'remeda';
import * as React from 'react';
import ReactDOM from 'react-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl, { GeoJSONSourceRaw } from 'mapbox-gl';
import GeoJSON from 'geojson';
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
  );
}

export function MapViz({ dataframe }: Props): JSX.Element {
  const { data, fields } = dataframe;
  const mapRef = React.useRef<mapboxgl.Map | null>(null);
  const tooltipRef = React.useRef(
    new mapboxgl.Popup({ offset: 15, maxWidth: '400px', closeButton: false }),
  );

  // TODO: first check if anything seems like it might be a geolocation
  const geojson: GeoJSONSourceRaw = React.useMemo(() => {
    const slicedData = data.slice(0, 100);
    return {
      type: 'geojson',
      data: GeoJSON.parse(slicedData, { Point: ['latitude', 'longitude'] }),
    };
  }, [data]);

  // set up the map
  React.useEffect(() => {
    if (!mapRef.current) {
      const map = new mapboxgl.Map({
        accessToken: process.env.REACT_APP_SCOUT_MAPBOX_API_KEY ?? '',
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-73.95, 40.72],
        zoom: 10,
        bearing: 0,
        pitch: 0,
        pitchWithRotate: false,
      });
      mapRef.current = map;

      map.on('load', () => {
        // add the points as a GeoJSON source
        console.log(geojson);
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
  }, [geojson, fields]);

  return <div id="map" className="h-96 w-full sm:h-[90%]" />;
}
