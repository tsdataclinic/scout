import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

export default function GHPagesRedirect() {
  const [redirect, setRedirect] = useState(null);
  useEffect(() => {
    // This is for dealing with the 404 redirect issue on gh pages
    const target = sessionStorage.redirect;
    delete sessionStorage.redirect;

    if (target && target !== window.location.href) {
      let to = target;
      if (process.env.PUBLIC_URL) {
        to = `/${to
          .split('/')
          .slice(4)
          .join('/')}`;
      }
      setRedirect(to);
    }
  }, []);

  if (redirect) {
    return <Redirect to={redirect} />;
  }
  return <></>;
}
