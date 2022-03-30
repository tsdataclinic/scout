import { CSSProperties } from 'react';
import { keyframes } from '@emotion/react/macro';
import styled from '@emotion/styled/macro';

const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const StyledDiv = styled.div`
  animation: ${rotateAnimation} 1s linear infinite;
  background: transparent;
  border: 2px solid;
  border-bottom-color: transparent !important;
  border-radius: 100%;
  display: inline-block;
`;

type Props = {
  className?: string;

  /** The color of the spinner */
  color?: string;

  /** If loading is true then the spinner is shown */
  loading?: boolean;

  /** The diameter, in pixels, of the spinner */
  size?: number;

  /** Style overrides for the spinner */
  style?: CSSProperties;
};

export default function LoadingSpinner({
  className = undefined,
  color = '#5f6d79',
  loading = true,
  size = 20,
  style = undefined,
}: Props): JSX.Element | null {
  const styleOverrides = {
    borderColor: color,
    height: size,
    width: size,
    ...style,
  };

  return loading ? (
    <StyledDiv style={styleOverrides} className={className} />
  ) : null;
}
