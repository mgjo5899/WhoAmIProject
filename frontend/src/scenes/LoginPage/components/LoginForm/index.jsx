import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import TextFieldGroup from '../../../../common/TextFieldGroup'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';

const style = {
	'marginTop': 25,
};

class LoginForm extends React.Component {
    
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
		};
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(){
		this.props.doLogin(this.state.email, this.state.password);
	}
    
	render() {

		return (
			<div>
			<MuiThemeProvider>
			  <div>
			   <TextField
				 hintText="Enter your Email"
				 floatingLabelText="Email"
				 onChange = {(event,newValue) => this.setState({email:newValue})}
				 />
			   <br/>
				 <TextField
				   type="password"
				   hintText="Enter your Password"
				   floatingLabelText="Password"
				   onChange = {(event,newValue) => this.setState({password:newValue})}
				   />
				 <br/>
				 <RaisedButton label="Submit" primary={true} style={style} onClick={this.handleClick}/>
			 </div>
			 </MuiThemeProvider>
		  </div>
		);
	}
} 	

export default LoginForm;
