import React, { Component, Fragment } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, NavItem } from 'reactstrap';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { storeUser } from '../../store/actions/authActions';
import axios from 'axios';
import { SERVER } from '../../config';


class SignIn extends Component {
    state = {
        signInModal: false,
        email: '',
        password: '',
        errorMsg: ''
    }

    toggleSignIn = () => {
        this.setState({
            signInModal: !this.state.signInModal,
            errorMsg: ''
        });
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value,
            errorMsg: ''
        });
    }

    handleSubmit = e => {
        e.preventDefault();
        const { email, password } = this.state;
        this.signIn(email, password);
    }


    signIn = (email, password) => {
        axios.post(SERVER + '/signin', {
            email,
            password
        }).then(res => {
            const { status, user } = res.data;
            status ? this.props.storeUser(user) : this.setState({ errorMsg: 'Could not sign in' });
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <Fragment>
                <NavItem>
                    <Button color="dark" onClick={this.toggleSignIn}>Sign in</Button>
                </NavItem>
                <Modal isOpen={this.state.signInModal} toggle={this.toggleSignIn}>
                    <form onSubmit={this.handleSubmit}>
                        <ModalHeader toggle={this.toggleSignIn}>Sign in</ModalHeader>
                        <ModalBody>
                            <div className="form-group">
                                <label htmlFor="email">Email address</label>
                                <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" className="form-control" id="password" placeholder="Password" onChange={this.handleChange} />
                            </div>
                            {this.state.errorMsg && <div className="alert alert-danger" role="alert">{this.state.errorMsg}</div>}
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

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = dispatch => {
    return {
        storeUser: user => dispatch(storeUser(user)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignIn));