import React, { Component } from 'react';


import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';

const style = {
	'marginTop': 25,
};

class ResetPasswordForm extends React.Component {
    
	constructor(props) {
		super(props);
		this.state = {
      password: '',
      newPassword: '',
      pwConfirmation: '',
      correctPassword: false,
      errMessage: '',
    };
    
    this.passwordChange = this.passwordChange.bind(this);
	}

	passwordChange(){
		if(this.state.newPassword === this.state.pwConfirmation) {
		  axios('http://localhost:8000/reset_pw', {
			method: "put",
			data: {
				new_password: this.state.newPassword
			}
		  })
			.then((response)=>{
				console.log(response)
				this.props.history.push('/')
			})
			.catch((error)=>{
				console.log(error);
			})
		} else {
	
		  this.setState({ errMessage: "Please try again!" })
		}
		
	  };
	render() {

		return (
			<div>
				<MuiThemeProvider>
					<center>
						<div>
							<h3>Type New Password</h3>
							<TextField
							type = "password"
							hintText="New Password"
							floatingLabelText="New Password"
							onChange = {(event,newValue) => this.setState({newPassword:newValue})}
							/>
							<br/>
							<TextField
							type = "password"
							hintText="Confirmation"
							floatingLabelText="Confirmation"
							onChange = {(event,newValue) => this.setState({pwConfirmation:newValue})}
							/>
							<br/>
							<RaisedButton label="Submit" primary={true} style={style} onClick={this.passwordChange}/>
						</div>
					</center>
				</MuiThemeProvider>
			</div>
		);
	}
} 	

export default ResetPasswordForm;
