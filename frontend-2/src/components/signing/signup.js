import React, { Component, Fragment } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, NavItem, Alert } from 'reactstrap';
import axios from 'axios';

class SignUp extends Component {
    state = {
        signUpModal: false,
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        confirmPassword: '',
        warningMsg: false
    }

    resetState = () => {
        this.setState({
            signUpModal: false,
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            confirmPassword: '',
            warningMsg: false
        });
    }

    toggleSignUp = () => {
        this.resetState();
        this.setState({
            signUpModal: !this.state.signUpModal
        });
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value,
            warningMsg: false
        });
    }

    handleSubmit = e => {
        e.preventDefault();
        const { email, firstName, lastName, password, confirmPassword } = this.state;
        if (password !== confirmPassword) {
            this.setState({ warningMsg: true });
        } else {
            axios.post('http://localhost:8000/register', {
                username: `${firstName} ${lastName}`,
                password,
                email
            }).then(res => {
                const { status } = res.data;
                if (status) {
                    console.log('successful');
                    this.resetState();
                } else {
                    console.log('error with singing up');
                }
            }).catch(err => {
                console.log(err)
            });
        }
        console.log(this.state);
    }

    render() {
        return (
            <Fragment>
                <NavItem>
                    <Button color="light" onClick={this.toggleSignUp}>Sign up</Button>
                </NavItem>
                <Modal isOpen={this.state.signUpModal} toggle={this.toggleSignUp}>
                    <form onSubmit={this.handleSubmit}>
                        <ModalHeader toggle={this.toggleSignUp}>Sign up</ModalHeader>
                        <ModalBody>
                            <div className="form-group">
                                <label htmlFor="email">Email address</label>
                                <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" onChange={this.handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="firstName">Enter first name</label>
                                <input type="text" className="form-control" id="firstName" placeholder="First Name" onChange={this.handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Enter last name</label>
                                <input type="text" className="form-control" id="lastName" placeholder="Last Name" onChange={this.handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" className="form-control" id="password" placeholder="Password" onChange={this.handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm password</label>
                                <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm password" onChange={this.handleChange} required />
                            </div>
                            {this.state.warningMsg && <Alert color="warning">Check your password</Alert>}
                        </ModalBody>
                        <ModalFooter>
                            <Button type="submit" color="primary">Sign Up</Button>{' '}
                            <Button type="button" color="danger" onClick={this.toggleSignUp}>Cancel</Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </Fragment>
        );
    }
}

export default SignUp;