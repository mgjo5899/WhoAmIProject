import React, { Component } from 'react';
import LoginForm from './components/LoginForm';
import SendEmailForm from './components/SendEmailForm';
import Dashboard from '../../scenes/Dashboard';
import { connect } from "react-redux";
import { doLogin, doLogout } from "../../actions/auth";
import NavBar from '../../common/NavBar';

let LoginComponent = ({ auth, doLogin, doLogout }) => (
	<div>
		<NavBar auth={auth} doLogout={doLogout}/>
		<div className="row">
			<div style={{display: 'flex', justifyContent: 'center'}} className="col-md-4 col-md-offset-4">
				<LoginForm auth={auth} doLogin={doLogin} doLogout={doLogout}/>
			</div>
		</div>
	</div>
);

let DashboardComponent = ({ auth, doLogin, doLogout }) => (
	<div>
		<NavBar auth={auth} doLogout={doLogout}/>
		<div className="row">
			<div style={{display: 'flex', justifyContent: 'center'}} className="col-md-4 col-md-offset-4">
				<Dashboard auth={auth} doLogin={doLogin} doLogout={doLogout}/>
			</div>
		</div>
	</div>
);

let SendEmailComponent = ({ auth, doLogin, doLogout }) => (
	<div>
		<NavBar auth={auth} doLogout={doLogout}/>
		<div className="row">
			<div style={{display: 'flex', justifyContent: 'center'}} className="col-md-4 col-md-offset-4">
				<SendEmailForm auth={auth} doLogin={doLogin} doLogout={doLogout}/>
			</div>
		</div>
	</div>
);

class LoginPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			forgotPassword: false,
		};
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(){
		this.setState({ forgotPassword: true })
	}

	render() {
		if (this.props.auth.isLoggedIn) {
			return (
				<DashboardComponent
					auth={this.props.auth}
					doLogin={this.props.doLogin}
					doLogout={this.props.doLogout}
				/>
			)
		} else {

			return (
				<div>
					{!this.state.forgotPassword
						? 	(
							<div>
								<LoginComponent
									auth={this.props.auth}
									doLogin={this.props.doLogin}
									doLogout={this.props.doLogout}
								/>
								<br/>
								<p onClick={this.handleClick} style={{display: 'flex', justifyContent: 'center'}}>Forgot my Password</p>
							</div> 
							)
						: (  <div>
								<SendEmailComponent
									auth={this.props.auth}
									doLogin={this.props.doLogin}
									doLogout={this.props.doLogout}
								/>
						</div> 
						)
					}

				</div>
			)
		}
	}
}

// Connects state to the props of this component
const mapStateToProps = state => ({
  auth: state.auth,
});

// Return a NEW component that is connected to the Store
export default connect(mapStateToProps, { doLogin, doLogout })(LoginPage);

//export default LoginPage;
