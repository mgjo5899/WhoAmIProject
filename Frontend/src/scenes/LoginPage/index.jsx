import React, { Component } from 'react';
import LoginForm from './components/LoginForm';
import { HashRouter, Route } from 'react-router-dom';


import { connect } from "react-redux";


import { doLogin, doLogout } from "../../actions/auth";

import NavBar from '../../common/NavBar';
import axios from 'axios'

//class LoginPage extends Component {
//
//  render() {
//    return (
//      <div>
//        <NavBar />
//       	<div className="row">
//       		<div style={{display: 'flex', justifyContent: 'center'}} className="col-md-4 col-md-offset-4">
//       			<LoginForm />
//       		</div>
//       	</div>
//      </div>
//    );
//  }
//}

const LoginPage = ({ auth, doLogin, doLogout }) => (

    <div>

      <NavBar/>
     	<div className="row">
     		<div style={{display: 'flex', justifyContent: 'center'}} className="col-md-4 col-md-offset-4">
     			<LoginForm doLogin={doLogin} doLogout={doLogout} auth={auth} />
     		</div>
       	</div>
      </div>

);
const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { doLogin, doLogout })(LoginPage);

//export default LoginPage;
