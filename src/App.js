import React from 'react';
import './App.css';
import HomePage from './layout/HomePage';

import {BrowserRouter as Router, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Route path="/" exact={true} component={HomePage} />
      </div>
    </Router>
  );
}

export default App;
