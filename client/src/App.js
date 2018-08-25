import React, { Component } from 'react';
import './App.css';

import Header from './components/common/Header/Header';
import Router from './components/common/Router';

import Card from './components/common/BotCard/BotCardSmall';

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
