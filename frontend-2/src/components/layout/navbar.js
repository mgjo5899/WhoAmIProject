import React, { Component, Fragment } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav
} from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import SignIn from '../signing/signin';
import SignUp from '../signing/signup';

export default class extends Component {

    state = {
        isOpen: false,
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    render() {
        return (
            <Fragment>
                <Navbar color="light" light expand="md">
                    <NavbarBrand tag={Link} to="/">WhoAmI</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            {/* Adding modal here */}
                            {/* RegisterModal */}
                            <SignUp />
                            {/* SignInModal */}
                            <SignIn />
                        </Nav>
                    </Collapse>
                </Navbar>
            </Fragment>
        );
    }
}