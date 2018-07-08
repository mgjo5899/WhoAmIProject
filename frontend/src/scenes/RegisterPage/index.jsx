import React from 'react';
import { connect } from "react-redux";
import { registerUser } from "../../actions/auth";
import Dashboard from '../../scenes/Dashboard';
import RegisterForm from './components/RegisterForm';
import NavBar from '../../common/NavBar';

const RegisterComponent = ({ auth, registerUser }) => (
  <div>
    <div style={{'textAlign':'center'}}>
      <h1>Create a New Account</h1>
      <h2 style={{'fontWeight':'lighter'}}>Who are you?</h2>
    </div>
    <div className="row">
      <div style={{display: 'flex', justifyContent: 'center'}} className="col-md-4 col-md-offset-4">
        <RegisterForm auth={auth} registerUser={registerUser}/>
      </div>
    </div>
  </div>
);

let DashboardComponent = ({ auth, doLogin, doLogout }) => (
	<div>
		<NavBar auth={auth} doLogout={doLogout}/>
		<div className="row">
			<div style={{display: 'flex', justifyContent: 'center'}} className="col-md-4 col-md-offset-4">
				<Dashboard auth={auth} registerUser={registerUser} doLogin={doLogin} doLogout={doLogout}/>
			</div>
		</div>
	</div>
);

class RegisterPage extends React.Component {
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
				<RegisterComponent
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
export default connect(mapStateToProps, { registerUser })(RegisterPage);

//export default RegisterPage;
