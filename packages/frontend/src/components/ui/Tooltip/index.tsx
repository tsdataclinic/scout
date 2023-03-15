import * as React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import styled, { keyframes } from 'styled-components';

type Props = {
  children: React.ReactNode;
  className?: string;
  content: React.ReactNode;
};

const slideUpAndFade = keyframes`
  from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideDownAndFade = keyframes`
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideLeftAndFade = keyframes`
  from {
    opacity: 0;
    transform: translateX(2px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideRightAndFade = keyframes`
  from {
    opacity: 0;
    transform: translateX(-2px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const TOOLTIP_COLOR = '#1e293b'; // tailwind: slate-800

const StyledTooltipContent = styled(RadixTooltip.Content)`
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  background-color: #1e293b; // slate-800
  color: white;
  border-radius: 4px;
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
    hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  font-size: 1rem;
  line-height: 1.25;
  max-width: 20rem;
  padding: 0.5rem 1rem;
  user-select: none;
  will-change: transform, opacity;
  z-index: 100;

  &[data-state='delayed-open'][data-side='top'] {
    animation-name: ${slideDownAndFade};
  }

  &[data-state='delayed-open'][data-side='right'] {
    animation-name: ${slideLeftAndFade};
  }

  &[data-state='delayed-open'][data-side='bottom'] {
    animation-name: ${slideUpAndFade};
  }

  &[data-state='delayed-open'][data-side='left'] {
    animation-name: ${slideRightAndFade};
  }
`;

const StyledArrow = styled(RadixTooltip.Arrow)`
  fill: ${TOOLTIP_COLOR};
`;

export default function Tooltip({
  children,
  content,
  className,
}: Props): JSX.Element {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root delayDuration={100}>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <StyledTooltipContent sideOffset={5} className={className}>
            {content}
            <StyledArrow />
          </StyledTooltipContent>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
