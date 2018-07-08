import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

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
			isLoading: false
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
                  hintText="Enter your Username"
                  floatingLabelText="Username"
                  onChange = {(event,newValue) => this.setState({username:newValue})}
                />
                <br/>
                <TextField
                  hintText="Enter your Email"
                  type="email"
                  floatingLabelText="Email"
                  onChange = {(event,newValue) => this.setState({email:newValue})}
                />
                <br/>
                <TextField
                  type = "password"
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

export default RegisterForm;