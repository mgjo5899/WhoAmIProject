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
              <Route path="/" exact component={APITest} />
              <Route path="/sign_up" component={RegisterPage} />
              <Route path="/sign_in" component={LoginPage} />
            </div>
          </HashRouter>

    );
  }
}

export default App;
