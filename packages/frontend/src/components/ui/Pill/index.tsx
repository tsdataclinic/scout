import classNames from 'classnames';
import * as React from 'react';

type Props = {
  children: React.ReactNode;
} & Omit<React.HTMLProps<HTMLDivElement>, 'children'>;

export default function Pill({
  children,
  className,
  ...passThroughProps
}: Props): JSX.Element {
  const spanClassName = classNames(
    'inline-block rounded bg-blue-500 py-1 px-2 text-white active:bg-blue-500',
    className,
  );

  return (
    <div
      className={spanClassName}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...passThroughProps}
    >
      {children}
    </div>
  );
}
