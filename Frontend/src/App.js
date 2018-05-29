import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';

import LoginPage from './scenes/LoginPage';


class App extends Component {
  render() {
    return (

          <HashRouter>
            <div>
              <Route path="/" exact component={LoginPage} />
            </div>
          </HashRouter>

    );
  }
}

export default App;
