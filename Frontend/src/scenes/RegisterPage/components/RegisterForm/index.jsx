import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import TextFieldGroup from '../../../../common/TextFieldGroup'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios'
const style = {
	'margin-top': 25,
};

class RegisterForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
      username: '',
      email: '',
			password: '',
			errors: {},
			isLoading: false
    };
    
    this.handleClick = this.handleClick.bind(this);
	}
	
	handleClick(){

		axios.post('http://localhost:5000/users', 
		{
			username:this.state.username,
			email:this.state.email, 
			password:this.state.password
		})
      .then(function (response) {

        console.log(response);
        if(response.data.status === "Successful"){
          console.log("Login successfull");
        }

        else if(response.data.error === "There is a user with the given username"){
          console.log("There is a user with the given username");
        }
        else if(response.data.error === "Email is not in a valid format"){
          console.log("Email is not in a valid format");
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