import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import TextFieldGroup from '../../../../common/TextFieldGroup'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const style = {
	'margin-top': 25,
};

class RegisterForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			identifier: '',
			password: '',
			errors: {},
			isLoading: false
		};


		this.onSubmit = this.onSubmit.bind(this);
		this.onChange = this.onChange.bind(this);

	}
	
	onSubmit(e) {
		e.preventDefault();
	}

	onChange(e) {
		this.setState({ [e.target.name] : e.target.value });
	}

	render() {

		const { errors, identifier, password, isLoading } = this.state

        return (
            <div>
              <MuiThemeProvider>
                <div>
                 <TextField
                   hintText="Enter your First Name"
                   floatingLabelText="First Name"
                   onChange = {(event,newValue) => this.setState({first_name:newValue})}
                   />
                 <br/>
                 <TextField
                   hintText="Enter your Last Name"
                   floatingLabelText="Last Name"
                   onChange = {(event,newValue) => this.setState({last_name:newValue})}
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
                 <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
                </div>
               </MuiThemeProvider>
            </div>
          );
}
} 	

export default RegisterForm;