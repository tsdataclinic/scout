import * as React from 'react';

export type SelectOption<T> = {
  disabled?: boolean;
  displayValue: React.ReactNode;
  value: T;
};

export type SelectOptionGroup<T> = {
  label: string;
  options: ReadonlyArray<SelectOption<T>>;
};
