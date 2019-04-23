import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { SERVER } from '../../config';
import { storeUser } from '../../store/actions/auth_actions';

class SignUp extends Component {
    state = {
        email: '',
        password: '',
        username: '',
        errorMsg: ''
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value,
            errorMsg: ''
        });
    }

    handleSubmit = e => {
        e.preventDefault();
        const { email, username, password } = this.state;
        this.registerUser({ email, password, username });
    }

    registerUser = userInfo => {
        console.log(userInfo)
        axios.post(SERVER + '/register', userInfo)
            .then(res => {
                const { status, message } = res.data;
                if (status) {
                    const { email, password } = userInfo;
                    this.signIn(email, password);
                } else {
                    this.setState({ errorMsg: message });
                }
            }).catch(err => {
                console.log(err);
            });
    }

    signIn = (email, password) => {
        axios.post(SERVER + '/signin', {
            email,
            password
        }).then(res => {
            this.props.storeUser(res.data.user);
            console.log(res.data.user)
        }).catch(err => {
            console.log(err);
        });
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
                        {this.state.errorMsg && <div className="alert alert-danger" role="alert">{this.state.errorMsg}</div>}
                    </div>
                    <div className="card-footer">
                        <button type="submit" className="btn btn-primary col-sm-12">Sign up</button>
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
        storeUser: user => dispatch(storeUser(user))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);