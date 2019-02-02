import React, { Component } from 'react';
import { connect } from 'react-redux';
import { throwError, registerUser } from '../../store/actions/authActions';

class SignUp extends Component {
    state = {
        email: '',
        password: '',
        username: '',
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value,
        });
        this.props.throwError('SIGNUP_ERR', '');
    }

    handleSubmit = e => {
        e.preventDefault();
        const { email, username, password } = this.state;
        const { registerUser } = this.props
        registerUser({ email, password, username });
    }

    render() {
        return (
            <form id="sign-up-form" onSubmit={this.handleSubmit}>
                <div className="card">
                    <h5 className="card-header">Sign up</h5>
                    <div className="card-body">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Email" onChange={this.handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" className="form-control" id="username" placeholder="Username" onChange={this.handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" id="password" placeholder="Password" onChange={this.handleChange} required />
                        </div>
                        {this.props.auth.errorMsg.signUp && <div className="alert alert-danger" role="alert">{this.props.auth.errorMsg.signUp}</div>}
                    </div>
                    <div className="card-footer">
                        <button type="submit" className="btn btn-primary col-sm-12">Sign Up</button>
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