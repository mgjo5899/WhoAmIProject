import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { Button, ButtonIcon } from 'rmwc/Button';
import { TextField, TextFieldIcon, TextFieldHelperText } from 'rmwc/TextField';
import axios from 'axios';

import './styles.css';

const style = {
	'marginTop': 25,
};

class SendEmailForm extends React.Component {
    
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			sentMessage: '',
		};
		this.sendVerification = this.sendVerification.bind(this);
		this.getEmail = this.getEmail.bind(this);
	}

	getEmail(event) {
		this.setState({email:event.target.value})
	}

	sendVerification(){
		axios('http://localhost:8000/send_pwreset_email', {
			method: "post",
			data: {
				email: this.state.email,
			}
			})
			.then((response)=>{
				console.log(response)
				this.setState({ sentMessage: "E-mail sent! Please check your inbox." })
			})
			.catch((error)=>{
				console.log(error);
		})
	}
    
	render() {

		return (
			<div className="outlinedText">
				<div className="row">
						<MuiThemeProvider>
							<br/>
							<br/>
							<h2 style={{'textAlign':'center', 'fontSize':'1.2em'}}>Forgot your password?</h2>
								<div>
								<TextField
									label="Email"
									onChange={this.getEmail}
								/>
								<br/>
								<br/>
								<Button
									className="submitButton"
									onClick={this.handleClick}
								>
								Send
								</Button>
								<br/>
								<br/>
								<center><p>{this.state.sentMessage}</p></center>
							</div>
						</MuiThemeProvider>
					</div>
				</div>
		  
		);
	}
} 	

export default SendEmailForm;
