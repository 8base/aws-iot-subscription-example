import React, { Component } from 'react';
import './App.css';

import Chatroom from './Chatroom.js';
import Login from './Login.js';

class App extends Component {
  render() {
    console.log(this)
    if (localStorage.getItem("isLoggin")) {
      return (
        <div>
            <div className="App">
                <Chatroom />        
            </div>
        </div>
      );
    }

    return (
      <div className="App">
        <Login />        
      </div>
    );
  }
}

export default App;
