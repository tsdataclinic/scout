import classNames from 'classnames';
import type { ReactNode, CSSProperties } from 'react';
import InfoIcon from '../InfoIcon';

type Props = {
  children: ReactNode;
  className?: string;
  helperText?: string;
  htmlFor?: string;
  infoTooltip?: string;
  inline?: boolean;
  inlineContainerStyles?: CSSProperties;
  label: string;
  labelAfter?: boolean;
  labelSize?: 'small' | 'normal';
  labelTextClassName?: string;
  labelTextStyle?: CSSProperties;
};

/**
 * This is a lightweight component to just wrap a component with a
 * label and add a little spacing.
 */
export default function LabelWrapper({
  className,
  children,
  inline = false,
  inlineContainerStyles,
  label,
  helperText,
  labelAfter = false,
  labelTextClassName,
  labelTextStyle,
  infoTooltip,
  htmlFor,
  labelSize = 'normal',
}: Props): JSX.Element {
  const childrenBlock = inline ? (
    <div className="inline-block" style={inlineContainerStyles}>
      {children}
    </div>
  ) : (
    children
  );

  const labelClassName = classNames(labelTextClassName, {
    'inline-block': inline,
    'text-sm': labelSize === 'small',
    'text-base': labelSize === 'normal',
  });

  const tooltipIcon = infoTooltip ? <InfoIcon tooltip={infoTooltip} /> : null;

  const helperTextDiv = helperText ? (
    <div className={labelClassName} style={labelTextStyle}>
      <small>
        <i>{helperText}</i>
      </small>
    </div>
  ) : null;

  let labelComponent = null;
  if (htmlFor) {
    // if an `htmlFor` id is specified then we shouldn't nest the children
    // inside the label
    labelComponent = (
      <div className={inline ? 'space-x-2' : 'space-y-1'}>
        {labelAfter ? childrenBlock : null}
        <label htmlFor={htmlFor}>
          <div className={labelClassName} style={labelTextStyle}>
            {label} {tooltipIcon}
          </div>
          {helperTextDiv}
        </label>
        {labelAfter ? null : childrenBlock}
      </div>
    );
  } else {
    // if an `htmlFor` id was not specified, then nest the children inside the
    // label so that the browser can associate them
    labelComponent = (
      <label className={inline ? 'space-x-2' : 'space-y-1'} htmlFor={htmlFor}>
        {labelAfter ? childrenBlock : null}
        <div className={labelClassName} style={labelTextStyle}>
          {label} {tooltipIcon}
          {helperTextDiv}
        </div>
        {labelAfter ? null : childrenBlock}
      </label>
    );
  }

  return <div className={className}>{labelComponent}</div>;
}
