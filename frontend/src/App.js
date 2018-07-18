import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';

import LoginPage from './scenes/LoginPage';
import RegisterPage from './scenes/RegisterPage';
import SettingsPage from './scenes/SettingsPage';

import axios from 'axios';

axios.defaults.withCredentials = true  // enable axios post cookie, default false

class App extends Component {


  render() {
    return (
          <HashRouter>
            <div>
              <Route path="/" exact component={LoginPage} />
              <Route path="/signup" component={RegisterPage} />
              <Route path="/signin" component={LoginPage} />
              <Route path="/settings" component={SettingsPage} />
            </div>
          </HashRouter>
    );
  }
}

export default App;
