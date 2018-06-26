import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';

import LoginPage from './scenes/LoginPage';
import APITest from './scenes/APITest';
import axios from 'axios'
import RegisterPage from './scenes/RegisterPage';

class App extends Component {


  render() {


    return (

          <HashRouter>
            <div>
              <Route path="/" exact component={LoginPage} />
              <Route path="/signup" component={RegisterPage} />
              <Route path="/signin" component={LoginPage} />
            </div>
          </HashRouter>

    );
  }
}

export default App;
