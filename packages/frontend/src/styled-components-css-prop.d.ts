/* eslint-disable */
import { CSSProp } from 'styled-components';

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

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      css?: CSSProp;
    }
  }
}
