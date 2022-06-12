import { useState } from 'react';
import type { FormEvent } from 'react';
import FormInput from './FormInput';

type Props = {
  onSubmitRegister: (
    email: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
};

export default function RegisterForm({ onSubmitRegister }: Props): JSX.Element {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmitRegister(email, firstName, lastName);
  };

  return (
    <div>
      <h2>Register</h2>
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
        <FormInput
          label="First name"
          type="text"
          value={firstName}
          onChange={setFirstName}
        />
        <FormInput
          label="Last name"
          type="text"
          value={lastName}
          onChange={setLastName}
        />
        <input style={{ display: 'block' }} type="submit" />
      </form>
    </div>
  );
}
