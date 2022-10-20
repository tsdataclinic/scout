import { useState } from 'react';
import type { FormEvent } from 'react';
import FormInput from './FormInput';

type Props = {
  onSubmitLogin: (email: string) => Promise<void>;
};

export default function LoginForm({ onSubmitLogin }: Props): JSX.Element {
  const [email, setEmail] = useState('');
  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmitLogin(email);
  };

  return (
    <div>
      <h2>Login</h2>
      <form
        style={{ marginTop: '2rem', fontSize: '1.5rem' }}
        onSubmit={onSubmit}
      >
        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
        />
        <input style={{ display: 'block' }} type="submit" />
      </form>
    </div>
  );
}
