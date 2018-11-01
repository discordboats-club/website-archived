import React, { Component } from 'react';
import './App.scss';

import Router from './components/common/Router';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router/>
      </div>
    );
  }
}

export default App;
