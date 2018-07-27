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
	}
	
	handleClick(){
		this.props.registerUser(this.state.username, this.state.email, this.state.password);
	}

	render() {
      return (
          <div>
            <MuiThemeProvider>
              <div>
                <TextField
                  className="outlinedText"
                  label="Enter your Username"
                  outlined
                  onChange = {(event, newValue) => this.setState({username:newValue})}
                />
                <br/>
                <TextField
                  className="outlinedText"
                  label="Enter your Email"
                  outlined
                  onChange = {(event, newValue) => this.setState({email:newValue})}
                />
                <br/>
                <TextField
                  className="outlinedText"
                  type="password"
                  label="Enter your Password"
                  outlined
                  onChange = {(event, newValue) => this.setState({password:newValue})}
                />
                <br/>
                <br/>
                <Button
                  className="submitButton"
                  raised
                  onClick={this.handleClick}
                >
                  Sign up for WhoAmI
                </Button>
                <br/>
              </div>
              </MuiThemeProvider>
          </div>
        );
  }
} 	

export default RegisterForm;