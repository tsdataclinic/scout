import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'normalize.css'; // Ensure consistent layout across browsers
import App from './App';
import * as serviceWorker from './serviceWorker';
import { StateProvider } from './contexts/OpenDataContext';
import { CollectionsProvider } from './contexts/CollectionsContext';

ReactDOM.render(
  <StateProvider>
    <CollectionsProvider>
      <App />
    </CollectionsProvider>
  </StateProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
