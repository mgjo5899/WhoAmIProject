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

const Navbar = () => (
  <div className="navbar">
    <div className="logo-container">
    </div>

    <div className="left-link-container">
      <Link to="/i/about">ABOUT</Link>
      <Link to="/i/#">MENU 2</Link>
      <Link to="/i/#">MENU 3</Link>
    </div>

    <div className="right-link-container">
      <Link to="#">Sign In</Link>
      <Link to="#">Register</Link>
    </div>
  </div>
);

export default Navbar;
