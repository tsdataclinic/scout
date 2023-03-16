import * as React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import type { Dataframe } from './types';

type Props = {
  dataframe: Dataframe;
};

export function Map({ dataframe }: Props): JSX.Element {
  const { data, fields } = dataframe;
  const mapRef = React.useRef<mapboxgl.Map | null>(null);
  console.log(data, fields);

  // TODO: first check if anything seems like it might be a geolocation

  // set the map
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
    }
  }, []);

  return <div id="map" className="h-96 w-full sm:h-[90%]" />;
}
