import 'styled-components/macro';
import { ChangeEvent, ForwardedRef, forwardRef, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  label: string;
  type: 'text' | 'email';
  onChange: (val: string) => void;
  value: string;
};

function FormInput(
  { label, type, value, onChange }: Props,
  inputRef: ForwardedRef<HTMLInputElement>,
): JSX.Element {
  const onInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(event.currentTarget.value);
  };
  const id = useMemo(() => uuidv4(), []);

  return (
    <div>
      <label htmlFor={id}>
        {label}
        <input
          required
          ref={inputRef}
          id={id}
          type={type}
          value={value}
          onChange={onInputChange}
          css={`
            border: 1px solid black;
            borderradius: 0.125rem;
            padding: 0.5rem 1rem;
            margin-bottom: 1rem;
            margin-left: 1rem;
          `}
        />
      </label>
    </div>
  );
}

export default forwardRef(FormInput);
