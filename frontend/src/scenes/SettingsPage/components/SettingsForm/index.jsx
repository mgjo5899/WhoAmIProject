import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import history from '../../../../history'

const style = {
	'marginTop': 25,
};

class SettingsForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
      password: '',
      newPassword: '',
      pwConfirmation: '',
      correctPassword: false,
      errMessage: '',
    };
    
    this.handleClick = this.handleClick.bind(this);
    this.passwordChange = this.passwordChange.bind(this);
	}
	
	handleClick(){
    //this.props.registerUser(this.state.username, this.state.email, this.state.password);
    console.log('email', this.props.auth)
    axios('http://localhost:8000/signin', {
      method: "post",
      data: {
          email: this.props.auth.email,
          password: this.state.password
      }
  })
      .then((response)=>{
          console.log(response)
          if (response.data.status === true) {
            this.setState({ correctPassword: true })
          } else {
              console.log(response.data.message);
          }
      })
      .catch((error)=>{
          console.log(error);
      })
  };
  
  passwordChange(){
    console.log('nwepw',this.state.newPassword)
    console.log('check',this.state.pwConfirmation)
    if(this.state.newPassword === this.state.pwConfirmation) {
      axios('http://localhost:8000/reset_pw', {
        method: "put",
        data: {
            new_password: this.state.newPassword
        }
      })
        .then((response)=>{
            console.log(response)
            history.push('/')
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
              {!this.state.correctPassword
                    ? (  <div>
                      <MuiThemeProvider>
                        <div>
                          <h3>Reset Password</h3>
                          <TextField
                            type = "password"
                            hintText="Original Password"
                            floatingLabelText="Original Password"
                            onChange = {(event,newValue) => this.setState({password:newValue})}
                          />
                          <br/>
                          <RaisedButton label="Submit" primary={true} style={style} onClick={this.handleClick}/>
                        </div>
                      </MuiThemeProvider>
                    </div> )
                    : (  <div>
                          <MuiThemeProvider>
                            <div>
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
                        </MuiThemeProvider>
                    </div> )
                }
            {this.state.errMessage}
          </div>
        );
  }
} 	

export default SettingsForm;