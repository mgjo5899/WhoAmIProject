import React, { Component, Fragment } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, NavItem } from 'reactstrap';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { storeUser, signIn, throwError } from '../../store/actions/authActions';


class SignIn extends Component {
    state = {
        signInModal: false,
        email: '',
        password: '',
    }

    toggleSignIn = () => {
        this.setState({
            signInModal: !this.state.signInModal,
        });
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value,
        });
        this.props.throwError('SIGNIN_ERR', '');
    }

    handleSubmit = e => {
        e.preventDefault();
        const { signIn } = this.props;
        const { email, password } = this.state;
        signIn(email, password);
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
                            {this.props.auth.errorMsg.signIn && <div className="alert alert-danger" role="alert">{this.props.auth.errorMsg.signIn}</div>}
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
        signIn: (email, password) => dispatch(signIn(email, password)),
        throwError: (type, errorMsg) => dispatch(throwError(type, errorMsg))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignIn));