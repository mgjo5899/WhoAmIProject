import React, { Component } from 'react';
import { connect } from 'react-redux';
import { throwError, registerUser } from '../../store/actions/authActions';

class SignUp extends Component {
    state = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        confirmPassword: '',
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value,
        });
        this.props.throwError('SIGNUP_ERR', '');
    }

    handleSubmit = e => {
        e.preventDefault();
        const { email, firstName, lastName, password, confirmPassword } = this.state;
        const { throwError, registerUser } = this.props
        if (password !== confirmPassword) {
            throwError('SIGNUP_ERR', 'Retype your password');
        } else {
            registerUser({ email, password, username: `${firstName} ${lastName}` });
        }
    }

    render() {
        return (
            <form id="sign-up-form" onSubmit={this.handleSubmit}>
                <div className="card">
                    <h5 className="card-header">Sign up</h5>
                    <div className="card-body">
                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Email" onChange={this.handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="firstName">First name</label>
                            <input type="text" className="form-control" id="firstName" placeholder="First Name" onChange={this.handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last name</label>
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
                        {this.props.auth.errorMsg.signUp && <div className="alert alert-danger" role="alert">{this.props.auth.errorMsg.signUp}</div>}
                    </div>
                    <div className="card-footer">
                        <button type="submit" className="btn btn-primary">Sign Up</button>
                    </div>
                </div>
            </form >
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
        throwError: (type, errorMsg) => dispatch(throwError(type, errorMsg)),
        registerUser: userInfo => dispatch(registerUser(userInfo))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);