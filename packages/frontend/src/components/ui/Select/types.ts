import * as React from 'react';

export type DropdownOption<T> = {
  disabled?: boolean;
  displayValue: React.ReactNode;
  value: T;
};

export type DropdownOptionGroup<T> = {
  label: string;
  options: ReadonlyArray<DropdownOption<T>>;
};
