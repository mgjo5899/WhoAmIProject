import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    Container,
    NavItem,
    NavLink
} from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import SignIn from '../signing/signin';

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
            <Navbar className="navbar-dark bg-dark mb-3" expand="md">
                <Container>
                    <NavbarBrand tag={Link} to="/">WhoAmI</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink tag={Link} to="/components">Components</NavLink>
                            </NavItem>
                            {/* Adding modal here */}
                            {/* SignInModal */}
                            <SignIn />
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
        );
    }
}