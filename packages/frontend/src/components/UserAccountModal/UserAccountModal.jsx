import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  useAttemptLogin,
  useAttemptSignUp,
  useCurrentUser,
} from '../../hooks/graphQLAPI';

import './UserAccountModal.scss';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [attemptLogin, { client }] = useAttemptLogin();
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  //   const { loading, data, error } = useAttemptLogin(email, password);
  const onSubmit = async e => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    try {
      const { data } = await attemptLogin({
        variables: { email, password },
      });
      if (data.signIn.error) {
        setErrorMessage(data.signIn.error);
      } else {
        localStorage.setItem('token', data.signIn.token);
        client.resetStore();
      }
    } catch (err) {
      setErrorMessage('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={onSubmit}>
        <label htmlFor="login-email">
          Email
          <input
            id="login-email"
            type="text"
            placeholder="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </label>

        <label htmlFor="login-password">
          Password
          <input
            id="login-password"
            type="password"
            placeholder="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
        </label>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <input type="submit" value="Submit" onSubmit={onSubmit} />
        )}
      </form>
    </div>
  );
}

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [attemptSignUp, { client }] = useAttemptSignUp();

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      return;
    }
    setErrorMessage(null);
    setLoading(true);

    try {
      const { data: signupData } = await attemptSignUp({
        variables: { email, password, username },
      });
      if (signupData.signUp.success) {
        localStorage.setItem('token', signupData.signUp.token);
        client.resetStore();
      } else {
        setErrorMessage(signupData.signUp.error);
      }
    } catch (err) {
      setErrorMessage('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={onSubmit}>
        <label htmlFor="signup-email">
          Email:
          <input
            id="signup-email"
            type="text"
            placeholder="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </label>

        <label htmlFor="signup-username">
          Username:
          <input
            id="signup-username"
            type="text"
            placeholder="username"
            onChange={e => setUsername(e.target.value)}
            value={username}
          />
        </label>

        <label htmlFor="signup-password">
          Password:
          <input
            id="signup-password"
            type="password"
            placeholder="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
          />
        </label>
        <label htmlFor="signup-password-confirm">
          Confirm Password:
          <input
            id="signup-password-confirm"
            type="password"
            placeholder="Confirm password"
            onChange={e => setConfirmPassword(e.target.value)}
            value={confirmPassword}
          />
        </label>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {loading ? <p>Loading...</p> : <input type="submit" value="Submit" />}
      </form>
    </div>
  );
}

export default function UserAccountModal() {
  const [activeTab, setActiveTab] = useState('login');
  const { data: currentUser } = useCurrentUser();
  console.log('current user ', currentUser);
  if (currentUser && currentUser.profile) {
    return <Navigate to="/profile" />;
  }
  return (
    <div className="user-account-modal">
      <div className="user-account-modal-inner">
        <div className="tabs">
          <button
            type="button"
            className={activeTab === 'login' ? 'active' : ''}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={activeTab === 'signup' ? 'active' : ''}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>
        {activeTab === 'login' && <Login />}
        {activeTab === 'signup' && <SignUp />}
      </div>
    </div>
  );
}
