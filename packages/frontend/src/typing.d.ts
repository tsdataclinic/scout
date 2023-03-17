/* eslint-disable */
/**
 * This file contains supplemental types for libraries that had incomplete
 * typings.
 */
import { CSSProp } from 'styled-components';
// import type { FeatureCollection, Feature, Geometry } from 'geojson';

/**
 * The type annotations in this file are needed to enable the `css`
 * prop in styled-components for TypeScript.
 *
 * This is copied from this github issue comment:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31245#issuecomment-823933029
 */
declare module 'react' {
  interface DOMAttributes<T> {
    css?: CSSProp;
  }
}

declare module 'geojson' {
  interface InvalidGeometryError extends Error {
    item: any;
    params: any;
  }

  type Geoms =
    | 'Point'
    | 'MultiPoint'
    | 'LineString'
    | 'MultiLineString'
    | 'Polygon'
    | 'MultiPolygon'
    | 'GeoJSON';

  interface GeomsParams extends Partial<Record<Geoms, string | string[]>> {
    Point?: string | string[];
  }

  type Data = { [key: string]: any } | any[];

  interface Params extends GeomsParams {
    doThrows?: {
      invalidGeometry: boolean;
    };
    removeInvalidGeometries?: boolean;
    extraGlobal?: { [key: string]: any };
    extra?: { [key: string]: any };
    crs?: any;
    bbox?: any[];
    include?: string[];
    exclude?: string[];
    isPostgres?: boolean;
    GeoJSON?: string;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      css?: CSSProp;
    }
  }

  namespace GeoJSON {
    const version: string;
    const defaults: Params;
    const errors: {
      InvalidGeometryError: InvalidGeometryError;
    };

    export function isGeometryValid(geometry: Geometry): boolean;
    export function parse<
      D extends Data = any,
      G extends Geometry | null = Geometry,
      P = GeoJsonProperties,
    >(
      data: D,
      params?: Params,
      callback?: (
        geojson: D extends any[] ? FeatureCollection<G, P> : Feature<G, P>,
      ) => void,
    ): D extends any[] ? FeatureCollection<G, P> : Feature<G, P>;
  }
}
