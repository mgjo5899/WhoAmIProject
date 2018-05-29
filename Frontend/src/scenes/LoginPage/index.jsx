import React, { Component } from 'react';
import LoginForm from './components/LoginForm';
import { HashRouter, Route } from 'react-router-dom';

import NavBar from './components/NavBar';

class LoginPage extends Component<InternalProps> {

  render() {
    return (
      <div>
        <NavBar />
       	<div className="row">
       		<div className="col-md-4 col-md-offset-4">
       			<LoginForm />
       		</div>
       	</div>
      </div>
    );
  }
}

export default LoginPage;
