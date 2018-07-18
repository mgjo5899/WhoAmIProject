import React from 'react';
import { connect } from "react-redux";
import { registerUser, doLogout } from "../../actions/auth";
import Dashboard from '../../scenes/Dashboard';
import SettingsForm from './components/SettingsForm';
import NavBar from '../../common/NavBar';

const SettingsComponent = ({ auth, registerUser }) => (
  <div>
		<NavBar auth={auth} doLogout={doLogout}/>
    <div style={{'textAlign':'center'}}>
      <h2 style={{'fontWeight':'lighter'}}>Settings Page</h2>
    </div>
    <div className="row">
      <div style={{display: 'flex', justifyContent: 'center'}} className="col-md-4 col-md-offset-4">
        <SettingsForm auth={auth} registerUser={registerUser}/>
      </div>
    </div>
  </div>
);

// TODO: make only accessible when logged on

class SettingsPage extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<SettingsComponent
				auth={this.props.auth}
				registerUser={this.props.registerUser}
				doLogin={this.props.doLogin}
				doLogout={this.props.doLogout}
			/>
		)
	}
}

// Connects state to the props of this component
const mapStateToProps = state => ({
  auth: state.auth,
});

// Return a NEW component that is connected to the Store
export default connect(mapStateToProps, { registerUser })(SettingsPage);

//export default RegisterPage;
