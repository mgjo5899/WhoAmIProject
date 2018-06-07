import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';

import LoginPage from './scenes/LoginPage';
import APITest from './scenes/APITest';
import axios from 'axios'

class App extends Component {


  render() {


    return (

          <HashRouter>
            <div>
              <Route path="/" exact component={LoginPage} />
              <Route path="/insta" exact component={APITest} />
            </div>
          </HashRouter>

    );
  }
}

export default App;
