import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { Button, ButtonIcon } from 'rmwc/Button';
import { TextField, TextFieldIcon, TextFieldHelperText } from 'rmwc/TextField';

import './styles.css';

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
		this.getPassword = this.getPassword.bind(this);
		this.getEmail = this.getEmail.bind(this);
	}

	handleClick(){
		this.props.doLogin(this.state.email, this.state.password);
	}
	

	getPassword(event) {
		this.setState({password:event.target.value})
	}
	
	getEmail(event) {
		this.setState({email:event.target.value})
	}

	render() {
		return (
			<div className="outlinedText">
			<MuiThemeProvider>
				<br/>
				<h2 style={{'textAlign':'center', 'fontSize':'1.2em'}}>Sign in to WhoAmI</h2>
			  <div>
                <TextField
                  className="outlinedText"
                  label="Email"
				  onChange={this.getEmail}
				/>
			   <br/>
                <TextField
					type="password"
                  	className="outlinedText"
                  	label="Password"
				  	onChange={this.getPassword}
				/>
				 <br/>
				 <br/>
                <Button
                  className="submitButton"
                  onClick={this.handleClick}
                >
                  Sign In
                </Button>
			 </div>
			 </MuiThemeProvider>
		  </div>
		);
	}
} 	

export default LoginForm;
