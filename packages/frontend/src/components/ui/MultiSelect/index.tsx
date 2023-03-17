import * as IconType from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import Select from '../Select';
import Pill from '../Pill';
import Button from '../Button';

type Props = {
  ariaLabel?: string;

  /** The width of the container where we display selected values */
  containerWidth?: number;
  id?: string;

  onChange: (selectedValues: string[]) => void;
  options: ReadonlyArray<{
    displayValue: React.ReactNode;
    value: string;
  }>;

  /**
   * The button label to display when no option is selected.
   * This will also be the default value for `ariaLabel` too.
   */
  placeholder: string;

  selectedValues: readonly string[];
};

export default function MultiSelect({
  ariaLabel,
  selectedValues,
  placeholder,
  onChange,
  options,
  id,
}: Props): JSX.Element {
  const selectedValuesSet = React.useMemo(
    () => new Set(selectedValues),
    [selectedValues],
  );

  const allItemsAreSelected = selectedValues.length === options.length;

  // process the current options and add a `disabled` state where necessary
  const optionsToRender = options.map(opt => ({
    ...opt,
    disabled: selectedValuesSet.has(opt.value),
  }));

  const optionsToDisplayVal = React.useMemo(
    () =>
      optionsToRender.reduce(
        (map, opt) => map.set(opt.value, opt.displayValue),
        new Map<string, React.ReactNode>(),
      ),
    [optionsToRender],
  );

  const onSelection = React.useCallback(
    (selectedValue: string) => {
      // only process if we haven't selected this value already
      if (!selectedValuesSet.has(selectedValue)) {
        onChange(selectedValues.concat(selectedValue));
      }
    },
    [onChange, selectedValues, selectedValuesSet],
  );

  const onRemoveSelection = React.useCallback(
    (valueToRemove: string) => {
      onChange(selectedValues.filter(val => val !== valueToRemove));
    },
    [onChange, selectedValues],
  );

  return (
    <div className="align-bottom">
      <Select
        // We reset the key so that the component remounts whenever the
        // `selectedValues` array changes length. This is due to a radix bug
        // where an `undefined` value makes the component uncontrolled rather
        // than unsetting the `value`
        key={selectedValues.length}
        id={id}
        value={undefined}
        ariaLabel={ariaLabel}
        options={optionsToRender}
        placeholder={placeholder}
        onChange={onSelection}
        disabled={allItemsAreSelected}
        iconType={IconType.faPlus}
      />

      <div className="inline-block">
        <div className="flex h-full flex-col space-y-2">
          {selectedValues.map(value => (
            <div key={value} className="ml-2">
              <Pill>
                {optionsToDisplayVal.get(value)}
                <Button unstyled onClick={() => onRemoveSelection(value)}>
                  <FontAwesomeIcon
                    className="ml-2"
                    size="sm"
                    icon={IconType.faX}
                  />
                </Button>
              </Pill>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
