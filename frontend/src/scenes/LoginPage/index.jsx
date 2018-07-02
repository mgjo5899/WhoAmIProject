import React, { Component } from 'react';
import LoginForm from './components/LoginForm';
import { connect } from "react-redux";
import { doLogin, doLogout } from "../../actions/auth";
import NavBar from '../../common/NavBar';

const LoginPage = ({ auth, doLogin, doLogout }) => (

    <div>

      <NavBar/>
     	<div className="row">
     		<div style={{display: 'flex', justifyContent: 'center'}} className="col-md-4 col-md-offset-4">
     			<LoginForm auth={auth} doLogin={doLogin} doLogout={doLogout}/>
     		</div>
       	</div>
      </div>

);

// Connects state to the props of this component
const mapStateToProps = state => ({
  auth: state.auth,
});

// Return a NEW component that is connected to the Store
export default connect(mapStateToProps, { doLogin, doLogout })(LoginPage);

//export default LoginPage;
