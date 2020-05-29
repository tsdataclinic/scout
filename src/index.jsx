import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'normalize.css'; // Ensure consistent layout across browsers
import App from './App';
import * as serviceWorker from './serviceWorker';
import { CollectionsProvider } from './contexts/CollectionsContext';
import { SearchProvider } from './contexts/SearchContext';

ReactDOM.render(
    <SearchProvider>
      <CollectionsProvider>
        <App />
      </CollectionsProvider>
    </SearchProvider>
 ,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
