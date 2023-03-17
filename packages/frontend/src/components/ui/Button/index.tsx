import * as React from 'react';
import classNames from 'classnames';

type Props = {
  children: React.ReactNode;
  className?: string;
  intent?: 'primary' | 'danger' | 'default';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  size?: 'medium' | 'small';
  type?: 'button' | 'submit';

  unstyled?: boolean;
  /**
   * Render the button in different default styles.
   * - `full`: Render the button with 100% width in its container and sharp edges.
   */
  variant?: 'normal' | 'full';
} & React.ComponentPropsWithoutRef<'button'>;

function BaseButton(
  {
    children,
    className,
    onClick,
    type = 'button',
    variant = 'normal',
    intent = 'default',
    unstyled = false,
    size = 'medium',
    ...passThroughProps
  }: Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
): JSX.Element {
  const buttonClassName = classNames(
    className,
    'focus-visible:outline-fuchsia-700',
    unstyled
      ? undefined
      : {
          'transition-colors duration-200': true,
          'py-2 px-4': size === 'medium',
          'py-1 px-2': size === 'small',
          // variant-dependent styles
          rounded: variant === 'normal',
          'w-full rounded-none': variant === 'full',

          // intent-dependent styles (only apply if our variant isn't "unstyled")
          'bg-blue-500 hover:bg-blue-400 active:bg-blue-500 text-white':
            intent === 'primary',
          'bg-red-500 hover:bg-red-400 active:bg-red-500 text-white':
            intent === 'danger',
          'bg-gray-200 hover:bg-gray-300 active:bg-gray-200 text-gray-800 hover:text-gray-900':
            intent === 'default',
        },
  );

  return (
    /* eslint-disable react/button-has-type, react/jsx-props-no-spreading */
    <button
      type={type}
      ref={forwardedRef}
      className={buttonClassName}
      onClick={onClick}
      {...passThroughProps}
    >
      {children}
    </button>
    /* eslint-enable */
  );
}

const Button = React.forwardRef(BaseButton);
export default Button;
