import React from 'react';
import { Redirect } from 'react-router-dom';
import { useCurrentUser } from '../../hooks/graphQLAPI';
import './ProfilePage.scss';

export function ProfilePage() {
  const { client, data, loading, error } = useCurrentUser();

  if (loading) {
    return <h2>Loading ...</h2>;
  }

  if (error) {
    return <Redirect to="/login" />;
  }

  const { profile } = data;

  const signout = () => {
    localStorage.removeItem('token');
    try {
      client.resetStore();
    } catch (err) {
      console.log('issue after logout ', err);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-page-inner">
        <h2>
          Welcome {profile.username} <button onClick={signout}>signout</button>
        </h2>
      </div>
    </div>
  );
}
