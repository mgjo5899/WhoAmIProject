import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
	Card,
	CardPrimaryAction,
	CardMedia,
	CardAction,
	CardActions,
	CardActionButtons,
	CardActionIcons
} from 'rmwc/Card';
  

const style = {
	'marginTop': 25,
};


class Dashboard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
		};

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(){
		this.props.doLogin(this.state.email, this.state.password);
	}

	verificationMessage = () => (
		<div style={{
			'textAlign':'center',
			'backgroundColor':'gray',
			'borderWidth': '1px',
			'padding':'1em',
			'marginTop': '1em',
			'borderRadius':'15px',
			'backgroundColor':'#F7F3CA'
		}}>
			<h4>Verify Your Email Address</h4>
			<p>We have sent a verification mail to <b>{this.props.auth.email}</b>. Please activate your account with the link in this email.</p>
		</div>
	);

	render() {
		return (
			<div>
			<MuiThemeProvider>
			  <div>
				{
					!this.props.auth.isConfirmed
						? this.verificationMessage()
						: ( <div/> )
				}
			  	<h1 style={{'textAlign':'center'}}>{this.props.auth.username}'s Dashboard</h1>
			 </div>
			 </MuiThemeProvider>
		  </div>
		);
	}
} 	

export default Dashboard;