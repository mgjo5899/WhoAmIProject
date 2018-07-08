// @flow
import React from 'react';
import { NavLink } from 'react-router-dom';

import './styles.css';

const Link = props => (
  <NavLink className="nav-link" {...props}>
    <div className="link-container">
      <div>
        <div>{props.children}</div>
      </div>
    </div>
  </NavLink>
);

class Navbar extends React.Component {

  constructor(props) {
		super(props);

		this.handleLogout = this.handleLogout.bind(this);
	}

  handleLogout() {
    this.props.doLogout()
  }

  render() {
    if (this.props.auth.isLoggedIn) {
      return(
        <div className="navbar">
          <div className="logo-container">
          </div>
          
          <div className="left-link-container">
            <Link to="/i/about">ABOUT</Link>
            <Link to="/i/#">MENU 2</Link>
            <Link to="/i/#">MENU 3</Link>
          </div>
  
          <div className="right-link-container">
            <Link to="/signup">Welcome, {this.props.auth.username}!</Link>
            <Link to="/signin" onClick={this.handleLogout}>Sign Out</Link>
          </div>
        </div>
      );
    } else {
      return(
        <div className="navbar">
          <div className="logo-container">
          </div>
          
          <div className="left-link-container">
            <Link to="/i/about">ABOUT</Link>
            <Link to="/i/#">MENU 2</Link>
            <Link to="/i/#">MENU 3</Link>
          </div>
  
          <div className="right-link-container">
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Register</Link>
          </div>
        </div>
      );
    }
  }
}

export default Navbar;
