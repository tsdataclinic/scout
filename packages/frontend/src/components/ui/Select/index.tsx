import * as IconType from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo } from 'react';
import styled from 'styled-components/macro';
import * as RadixSelect from '@radix-ui/react-select';
import SelectOptionItem from './SelectOptionItem';
import type { SelectOption, SelectOptionGroup } from './types';
import Tooltip from '../Tooltip';

// re-export these types
export type { SelectOption, SelectOptionGroup };

export const StyledTriggerButton = styled(RadixSelect.Trigger)`
  all: unset;
  background: white;
  border-radius: 4px;

  // create a border using box-shadow. We aren't using border because a border
  // affects the dimensions
  box-shadow: 0 0 0 1px #a3a3a3;
  padding: 6px 15px;

  &:hover {
    background-color: #f5f5f5;
  }

  &:focus {
    // blue outline on focus
    box-shadow: 0 0 0 2px #3b82f6;
  }

  &[data-disabled] {
    color: #94a3b8;
    cursor: not-allowed;
    &: hover {
      background-color: inherit;
    }
  }
`;

const StyledSelectContent = styled(RadixSelect.Content)`
  background-color: white;
  border-radius: 4px;
  box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35),
    0px 10px 20px -15px rgba(22, 23, 24, 0.2);
  overflow: hidden;
  z-index: 9999;
`;

const StyledSelectViewport = styled(RadixSelect.Viewport)`
  padding: 5px;
`;

const StyledGroupLabel = styled(RadixSelect.Label)`
  color: #94a3b8; // slate-400
  font-size: 0.95rem;
  line-height: 1.5rem;
  padding: 0 1.5rem;
`;

const StyledSeparator = styled(RadixSelect.Separator)`
  height: 1px;
  background-color: #cbd5e1;
  margin: 5px;
`;

type Props<T> = {
  ariaLabel?: string;
  className?: string;
  defaultValue?: T | undefined;
  disabled?: boolean;
  iconType?: IconType.IconDefinition;
  id?: string;
  name?: string;
  onChange?: (value: T) => void;
  options: ReadonlyArray<SelectOptionGroup<T> | SelectOption<T>>;
  /**
   * The button label to display when no option is selected.
   * This will also be the default value for `ariaLabel` too.
   */
  placeholder?: string;
  required?: boolean;
  value?: T | undefined;
};

export default function Select<T extends string>({
  ariaLabel,
  className,
  defaultValue,
  placeholder,
  name,
  onChange,
  required,
  options,
  value,
  id,
  disabled,
  iconType = IconType.faChevronDown,
}: Props<T>): JSX.Element {
  const ariaLabelToUse = ariaLabel ?? placeholder;
  const selectItems = useMemo(
    () =>
      options.map((obj, i) => {
        if ('options' in obj) {
          // if 'options' is present then this is a SelectOptionGroup
          return (
            <>
              <RadixSelect.Group>
                <StyledGroupLabel>{obj.label}</StyledGroupLabel>
                {obj.options.map(option => (
                  <SelectOptionItem key={option.value} option={option} />
                ))}
              </RadixSelect.Group>
              {i !== options.length - 1 ? <StyledSeparator /> : null}
            </>
          );
        }

        return <SelectOptionItem key={obj.value} option={obj} />;
      }),
    [options],
  );

  const triggerButton = (
    <StyledTriggerButton
      id={id}
      className={className}
      aria-label={ariaLabelToUse}
      disabled={disabled || options.length === 0}
    >
      <RadixSelect.Value placeholder={placeholder} />
      <RadixSelect.Icon>
        <FontAwesomeIcon style={{ marginLeft: 8 }} icon={iconType} size="xs" />
      </RadixSelect.Icon>
    </StyledTriggerButton>
  );

  return (
    <RadixSelect.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onChange}
      name={name}
      required={required}
    >
      {options.length === 0 ? (
        <Tooltip content="This dropdown is empty">{triggerButton}</Tooltip>
      ) : (
        triggerButton
      )}

      <RadixSelect.Portal>
        <StyledSelectContent>
          <StyledSelectViewport>{selectItems}</StyledSelectViewport>
        </StyledSelectContent>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
