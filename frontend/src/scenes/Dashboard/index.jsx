import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Contents from './components/Contents';

import {
	Dialog,
	DefaultDialogTemplate,
	DialogSurface,
	DialogHeader,
	DialogHeaderTitle,
	DialogBody,
	DialogFooter,
	DialogFooterButton,
	DialogBackdrop
  } from 'rmwc/Dialog';

import { Fab } from 'rmwc/Fab';
const right = {
	flexGrow: 1,
	display: 'flex',
	flexDirection: 'row-reverse',
	marginRight: '2em',
	marginTop: '1em',
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
			<div style={right}>
				<div>
					<Dialog
						open={this.state.standardDialogOpen}
						onClose={evt => this.setState({standardDialogOpen: false})}>
						<DialogSurface>
							<DialogHeader>
								<DialogHeaderTitle>Add Component</DialogHeaderTitle>
							</DialogHeader>
							<DialogBody>

							</DialogBody>

						</DialogSurface>
						<DialogBackdrop />
					</Dialog>
				</div>
			<div>

			{/** Standard dialog usage */}

				{
					!this.props.auth.isConfirmed ? this.verificationMessage()
					: ( 
					<div>
						<Fab 
							className="fab-style"
							icon="add"
							onClick={evt => this.setState({standardDialogOpen: true})}
						/>
					</div>
					) 
				}
		  </div>
		  </div>
		);
	}
} 	

export default Dashboard;