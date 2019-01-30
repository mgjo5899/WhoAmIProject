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
import axios from 'axios';
import {connect} from 'react-redux';
import {storeUser} from '../../store/actions/authActions';

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
        axios.get('http://localhost:8000/signin')
        .then(res => {
            console.log(res.data);
            const {status, email} = res.data;
            if(status) return this.getSpecificUser(email);
        }).then(user => {
            this.props.storeUser(user);
            console.log('user found:',user);
        }).catch(err => {
            console.log(err)
        });
    }

    getSpecificUser = email => {
        axios.get('http://localhost:8000/users')
        .then(res => {
            const {status, users} = res.data;
            if(status) {
                return users.find(user => users.email === email);
            } else {
                console.log('status wrong', res);
            }
        }).catch(err => {
            console.log(err);
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

const mapStateToProps = state => {
    return {
        auth: state.auth,
        info: state.info
    }
}

const mapDispatchToProps = dispatch => {
    return {
        storeUser: user => dispatch(storeUser(user))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavbarLayout);