import React from 'react';
import './styles.css';
import { connect } from "react-redux";
import { registerUser } from "../../../../actions/auth";
import RegisterForm from '../RegisterForm';
import Dashboard from '../../../../scenes/Dashboard';

let GreetingComponent = ({ auth, registerUser }) =>{
	
	return(
		<div className='work-process-greeting'>
			<div className='content-section'>
				<div className='paragraph-section'>
                    <div className="row">
						<div className="col">
                            <h3>WhoAmI Project</h3>
                            <h5>
                                Create a board that represents yourself by only using data from social media.
                            </h5>
						</div>
						<div className="col2">
						    <RegisterForm auth={auth} registerUser={registerUser}/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

let DashboardComponent = ({ auth, doLogin, doLogout }) => (
	<div>
		<div className="row">
			<div style={{display: 'flex', justifyContent: 'center'}} className="col-md-4 col-md-offset-4">
				<Dashboard auth={auth} registerUser={registerUser} doLogin={doLogin} doLogout={doLogout}/>
			</div>
		</div>
	</div>
);

class Greeting extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		if (this.props.auth.isLoggedIn) {
			return (
				<DashboardComponent
					auth={this.props.auth}
					registerUser={this.props.registerUser}
					doLogin={this.props.doLogin}
					doLogout={this.props.doLogout}
				/>
			)
		} else {
			return (
				<GreetingComponent
					auth={this.props.auth}
					registerUser={this.props.registerUser}
					doLogin={this.props.doLogin}
					doLogout={this.props.doLogout}
				/>
			)
		}
	}
}

// Connects state to the props of this component
const mapStateToProps = state => ({
	auth: state.auth,
  });
  
  // Return a NEW component that is connected to the Store
  export default connect(mapStateToProps, { registerUser })(Greeting);