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
			identifier: '',
			username: '',
			password: '',
			errors: {},
			isLoading: false
		};

		this.handleClick = this.handleClick.bind(this);
	}
	

	handleClick(){

		var self = this;

		axios.post('http://localhost:5000/signin', 
		{
			username:this.state.username, 
			password:this.state.password
		})
			.then(function (response) {

			console.log(response);
			if(response.data.status === "Successful"){
				console.log("Login successfull");
			}

			else{
				console.log("There is no user with the given username and password");
				//alert("Username does not exist");
			}
			}
		)
		.catch(function (error) {

		console.log(error);
		});
	}

	render() {

		return (
			<div>
			<MuiThemeProvider>
			  <div>
			   <TextField
				 hintText="Enter your Username"
				 floatingLabelText="Username"
				 onChange = {(event,newValue) => this.setState({username:newValue})}
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