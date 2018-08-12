import React, { Component } from 'react';
import InstaLogo from '../../../src/icons/instagram.svg'
import FacebookLogo from '../../../src/icons/facebook.svg'
import SpotifyLogo from '../../../src/icons/spotify.svg'
import GithubLogo from '../../../src/icons/Github.svg'
import StackoverflowLogo from '../../../src/icons/stackoverflow.svg'
import QuoraLogo from '../../../src/icons/quora.svg'
import './styles.css'
import InstagramLogin from 'react-instagram-login';
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

const icons = {
	width: '180px',
	height: '180px',
	margin: '2em',
}

const grayScale = {
	width: '180px',
	height: '180px',
	margin: '2em',
    filter: 'grayscale(100%)',
}

const center = {
	display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
}

const responseInstagram = (response) => {
	console.log(response);
  }

class Dashboard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			authenticated: false,
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
								<div style={center}>
									<center>
										<img 
											style={this.state.authenticated ? icons : grayScale}
											src={InstaLogo}
											onClick={evt => this.setState({instaDialogOpen: true})}
										/>
										<img 
											style={this.state.authenticated ? icons : grayScale}
											src={FacebookLogo}
											/>
										<img 
											style={this.state.authenticated ? icons : grayScale}
											src={GithubLogo}
										/>
										<img 
											style={this.state.authenticated ? icons : grayScale}
											src={SpotifyLogo}
										/>
										<img 
											style={this.state.authenticated ? icons : grayScale}
											src={QuoraLogo}
										/>
										<img 
											style={this.state.authenticated ? icons : grayScale}
											src={StackoverflowLogo}
										/>
									</center>
								</div>
							</DialogBody>

						</DialogSurface>
						<DialogBackdrop />
					</Dialog>
				</div>
				<div>
					<Dialog
						open={this.state.instaDialogOpen}
						onClose={evt => this.setState({instaDialogOpen: false})}>
						<DialogSurface>
							<DialogHeader>
								<DialogHeaderTitle>Authentication</DialogHeaderTitle>
							</DialogHeader>
							<DialogBody>
								<div style={center}>
									<center>
									<InstagramLogin
										clientId="28093b117f974a9dbef7962e19faedce"
										buttonText="Authenticate Instagram"
										onSuccess={responseInstagram}
										onFailure={responseInstagram}
										implicitAuth={true}
									/>
									</center>
								</div>
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