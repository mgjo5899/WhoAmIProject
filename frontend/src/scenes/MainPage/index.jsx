import React, { Component } from 'react';
import Greeting from './components/Greeting'
import './styles.css';
import NavBar from '../../common/NavBar';
import { connect } from "react-redux";
import { doLogin, doLogout } from "../../actions/auth";
class MainPage extends Component {

	render(){
		return(
			<div className='processpage-frame'>
				<NavBar 
					auth={this.props.auth}
					doLogin={this.props.doLogin}
					doLogout={this.props.doLogout}/>
					
				<Greeting/>
			</div>
		);
	}

}
// Connects state to the props of this component
const mapStateToProps = state => ({
	auth: state.auth,
  });
  
  // Return a NEW component that is connected to the Store
  export default connect(mapStateToProps, { doLogin, doLogout })(MainPage);