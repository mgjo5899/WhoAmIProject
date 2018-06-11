import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';

import NavBar from '../../common/NavBar';
import axios from 'axios';
import RegisterForm from './components/RegisterForm';

class RegisterPage extends Component {

  componentWillMount() {
      /*
    axios.post('http://localhost:5000/register', {
        user: 'Fred',
        lastName: 'Flintstone'
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
      */
  }

  render() {
    return (
      <div>
        <NavBar />
       	<div className="row">
       		<div style={{display: 'flex', justifyContent: 'center'}} className="col-md-4 col-md-offset-4">
       			<RegisterForm />
       		</div>
       	</div>
      </div>
    );
  }
}

export default RegisterPage;
