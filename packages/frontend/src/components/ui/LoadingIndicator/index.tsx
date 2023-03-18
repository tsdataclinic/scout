import styled, { keyframes } from 'styled-components';
import classNames from 'classnames';

type Props = {
  className?: string;
};

const fadeAnimation = keyframes`
  0% {
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const StyledDot = styled.div`
  animation: ${fadeAnimation} 1.5s infinite;
  border-radius: 50%;
  background-color: #6b7280;
  height: 12px;
  margin: 0 5px;
  width: 12px;

  &:nth-child(2) {
    animation-delay: 0.5s;
  }

  &:nth-child(3) {
    animation-delay: 1s;
  }
`;

export default function LoadingIndicator({ className }: Props): JSX.Element {
  const divClassName = classNames('flex justify-center', className);
  return (
    <div className={divClassName}>
      <StyledDot />
      <StyledDot />
      <StyledDot />
    </div>
  );
}
