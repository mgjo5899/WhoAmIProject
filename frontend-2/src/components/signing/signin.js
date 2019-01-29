import React, { Component, Fragment } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, NavItem } from 'reactstrap';
import axios from 'axios';

class SignIn extends Component {
    state = {
        signInModal: false,
        email: '',
        password: ''
    }

    toggleSignIn = () => {
        this.setState({
            signInModal: !this.state.signInModal
        });
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value,
            warningMsg: false
        });
    }

    render() {
        return (
            <Fragment>
                <NavItem>
                    <Button color="light" onClick={this.toggleSignIn}>Sign in</Button>
                </NavItem>
                <Modal isOpen={this.state.signInModal} toggle={this.toggleSignIn}>
                    <form onSubmit={this.handleSubmit}>
                        <ModalHeader toggle={this.toggleSignIn}>Sign in</ModalHeader>
                        <ModalBody>
                            <div className="form-group">
                                <label htmlFor="email">Email address</label>
                                <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" className="form-control" id="password" placeholder="Password" />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="submit" color="primary">Sign in</Button>{' '}
                            <Button type="button" color="danger" onClick={this.toggleSignIn}>Cancel</Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </Fragment>
        );
    }
}

export default SignIn;