import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    Container
} from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import SignIn from '../signing/signin';
import SignOut from '../signing/signout';
import { connect } from 'react-redux';
import { storeUser, confirmed, checkSignedIn } from '../../store/actions/authActions';

class NavbarLayout extends Component {

    state = {
        isOpen: false,
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    componentWillMount = () => {
        this.props.checkSignedIn();
    }

    render() {
        const { loaded, signedIn } = this.props.auth;
        return (
            loaded && (
                <Navbar className="navbar-dark bg-dark mb-3" expand="md">
                    <Container>
                        <NavbarBrand tag={Link} to="/">whoami</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                {/* Adding modal here */}
                                {
                                    /* SignIn and SignOut */
                                    signedIn ? <SignOut /> : <SignIn />
                                }
                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
            )
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        storeUser: user => dispatch(storeUser(user)),
        confirmed: () => dispatch(confirmed()),
        checkSignedIn: () => dispatch(checkSignedIn())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavbarLayout);