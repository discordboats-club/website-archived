import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Header from './components/common/Header/Header';
import Router from './components/common/Router';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header/>
        <Router/>
      </div>
    );
  }
}

export default App;
