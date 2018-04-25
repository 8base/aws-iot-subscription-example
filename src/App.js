import React, { Component } from 'react';
import './App.css';

import Chatroom from './Chatroom.js';
import Login from './Login.js';

import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={Login} />
          <Route path="/chat" component={Chatroom} />
        </div>
      </Router>
    );
  }
}


export default App;