import * as React from 'react';
import * as RadixSlider from '@radix-ui/react-slider';
import styled from 'styled-components';

type Props = {
  onValueChange?: (value: number[]) => void;
  className?: string;
  value?: readonly number[];
  defaultValue?: readonly number[];
  orientation?: 'horizontal' | 'vertical';
  min?: number;
  max?: number;
  width?: number;
};

const APP_SLATE_COLOR = '#33424e';

const StyledSlider = styled(RadixSlider.Root)`
  align-items: center;
  display: flex;
  position: relative;
  touch-action: none;
  user-select: none;

  &[data-orientation='horizontal'] {
    height: 28px;
    width: 100%;
  }

  &[data-orientation='vertical'] {
    flex-direction: column;
    height: 100%;
    width: 28px;
  }
`;

const StyledSliderTrack = styled(RadixSlider.Track)`
  background-color: ${APP_SLATE_COLOR};
  border-radius: 9999px;
  flex-grow: 1;
  position: relative;

  &[data-orientation='horizontal'] {
    height: 3px;
    width: 100%;
  }

  &[data-orientation='vertical'] {
    height: 100%;
    width: 3px;
  }
`;

const StyledSliderRange = styled(RadixSlider.Range)`
  background-color: ${APP_SLATE_COLOR};
  border-radius: 9999px;
  height: 100%;
  position: absolute;
`;

const StyledSliderThumb = styled(RadixSlider.Thumb)`
  background-color: ${APP_SLATE_COLOR};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.33);
  border-radius: 10px;
  display: block;
  height: 16px;
  width: 16px;
  transition: all 150ms;

  span {
    position: relative;
    top: -22px;
    left: 3px;
  }

  &:hover {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.25);
  }
`;

export default function Slider({
  value,
  defaultValue,
  className,
  onValueChange,
  width,
  orientation = 'horizontal',
  min = 0,
  max = 10,
}: Props): JSX.Element {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<readonly number[]>(
    defaultValue ?? [min],
  );

  const onInternalValueChange = (val: number[]): void => {
    if (!isControlled) {
      setInternalValue(val);
    }
    if (onValueChange) {
      onValueChange(val);
    }
  };

  const valueToUse = isControlled ? value : internalValue;
  const [currMinVal, currMaxVal] = valueToUse;

  return (
    <span className="flex space-x-2">
      <span>{min}</span>
      <StyledSlider
        className={className}
        value={valueToUse as number[]}
        onValueChange={onInternalValueChange}
        min={min}
        max={max}
        orientation={orientation}
        style={{ width }}
      >
        <StyledSliderTrack>
          <StyledSliderRange />
        </StyledSliderTrack>
        <StyledSliderThumb>
          <span>{currMinVal}</span>
        </StyledSliderThumb>
        <StyledSliderThumb>
          <span>{currMaxVal}</span>
        </StyledSliderThumb>
      </StyledSlider>
      <span>{max}</span>
    </span>
  );
}
