import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomePage from './layout/HomePage/HomePage';
import DatasetPage from './layout/DatasetPage/DatasetPage';

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        <Route path="/" exact component={HomePage} />
        <Route path="/dataset/:datasetID" exact component={DatasetPage} />
      </div>
    </Router>
  );
}

export default App;
