import React from 'react';
import './App.css';
import HomePage from './layout/HomePage';
import DatasetPage from './layout/DatasetPage';

import {BrowserRouter as Router, Route} from 'react-router-dom';

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        <Route path="/" exact={true} component={HomePage} />
        <Route
          path="/dataset/:datasetID"
          exact={true}
          component={DatasetPage}
        />
      </div>
    </Router>
  );
}

export default App;
