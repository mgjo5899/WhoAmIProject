import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Button, ButtonIcon } from 'rmwc/Button';
import { TextField, TextFieldIcon, TextFieldHelperText } from 'rmwc/TextField';
import 'material-components-web/dist/material-components-web.css'
import './styles.css'

const style = {
	'marginTop': 25,
};

class RegisterForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
      username: '',
      email: '',
			password: '',
      isLoading: false,
      canSubmit: false,
    };
    
    this.handleClick = this.handleClick.bind(this);
    this.getUsername = this.getUsername.bind(this);
    this.getPassword = this.getPassword.bind(this);
    this.getEmail = this.getEmail.bind(this);
	}
	
	handleClick(){
    console.log(this.state.username, this.state.email)
		this.props.registerUser(this.state.username, this.state.email, this.state.password);
  }
  
  getUsername(event) {
    this.setState({username:event.target.value})
  }
  
  getPassword(event) {
    this.setState({password:event.target.value})
  }
  
  getEmail(event) {
    this.setState({email:event.target.value})
  }

	render() {
      return (
          <div>
            <MuiThemeProvider>
              <p style={{'fontSize' : '1.8rem', 'fontWeight':'bold'}}>Sign Up</p>
              <br/>
              <div className="signUpContainer">
                <TextField
                  className="outlinedText"
                  label="Username"
                  box
                  onChange = {this.getUsername}
                />
                <br/>
                <TextField
                  className="outlinedText"
                  label="Email"
                  box
                  onChange = {this.getEmail}
                />
                <br/>
                <TextField
                  className="outlinedText"
                  type="password"
                  label="Password"
                  box
                  onChange = {this.getPassword}
                />
                <br/>
                <br/>
                <Button
                  className="submitButton"
                  box
                  onClick={this.handleClick}
                >
                  Sign up for WhoAmI
                </Button>
                <br/>
                <br/>
                <p style={{'textAlign':'center', 'color':'red'}}>{this.props.auth.statusMessage}</p>
              </div>
              </MuiThemeProvider>
          </div>
        );
  }
} 	

export default RegisterForm;