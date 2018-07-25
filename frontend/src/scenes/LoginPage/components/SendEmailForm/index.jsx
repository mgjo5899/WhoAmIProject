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

class SendEmailForm extends React.Component {
    
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			sentMessage: '',
		};
		this.sendVerification = this.sendVerification.bind(this);
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
			<div>
				<div className="row">
					<div style={{display: 'flex', justifyContent: 'center'}} className="col-md-4 col-md-offset-4">
						<MuiThemeProvider>
							<div>
								<h3>Forgot your password?</h3>
									<TextField
										hintText="E-mail"
										floatingLabelText="E-mail"
										onChange = {(event,newValue) => this.setState({email:newValue})}
									/>
								<br/>
								<RaisedButton label="Send Verification E-mail" primary={true} style={style} onClick={this.sendVerification}/>
								<br/>
								<center><p>{this.state.sentMessage}</p></center>
							</div>
						</MuiThemeProvider>
					</div>
				</div>
		  </div>
		);
	}
} 	

export default SendEmailForm;
