import React, { Component } from 'react';
import axios from 'axios';

class SignUp extends Component {
    state = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        confirmPassword: '',
        errorMsg: ''
    }

    resetState = () => {
        this.setState({
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            confirmPassword: '',
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
        const { email, firstName, lastName, password, confirmPassword } = this.state;
        if (password !== confirmPassword) {
            this.setState({ errorMsg: 'Retype your password' });
        } else {
            axios.post('http://localhost:8000/register', {
                username: `${firstName} ${lastName}`,
                password,
                email
            }).then(res => {
                const { status } = res.data;
                if (status) {
                    console.log(res.data);
                    this.resetState();
                    document.getElementById('sign-up-form').reset();
                } else {
                    this.setState({ errorMsg: 'Email already exists' });
                }
            }).catch(err => {
                console.log(err);
            });
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
                        {this.state.errorMsg && <div className="alert alert-danger" role="alert">{this.state.errorMsg}</div>}
                    </div>
                    <div className="card-footer">
                        <button type="submit" className="btn btn-primary">Sign Up</button>
                    </div>
                </div>
            </form >
        );
    }
}

export default SignUp;