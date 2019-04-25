import React, { Component, Fragment } from 'react';
import Axios from 'axios';
import { SERVER } from '../../../config';
import SignedInSecure from '../../../secure/signed_in_secure';
import { connect } from 'react-redux';
import Navbar from '../../layout/navbar';

class ResetPasswordComponent extends Component {

    state = {
        errorMsg: '',
        newPassword: '',
        confirmPassword: ''
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value,
            errorMsg: ''
        });
    }

    componentWillMount = () => {
        SignedInSecure(this.props, '/');
    }

    handleSubmit = e => {
        e.preventDefault();
        const { newPassword, confirmPassword } = this.state;
        if (newPassword !== confirmPassword) {
            this.setState({
                errorMsg: 'Password does not match'
            });
        } else {
            console.log(SERVER);
            Axios.put(SERVER + '/reset_pw', {
                new_password: newPassword
            }).then(res => {
                const { status } = res.data;
                if (status) {
                    this.props.history.push('/');
                } else {
                    console.log('something wrong');
                }
            }).catch(err => {
                console.log(err);
            });
        }
    }

    render() {
        return (
            <Fragment>
                <Navbar />
                <div className="container">
                    <div className="card">
                        <h5 className="card-header">Reset password</h5>
                        <div className="card-body">
                            <div className="form-group">
                                <label htmlFor="newPassword">New password</label>
                                <input type="password" className="form-control" id="newPassword" placeholder="New password" onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm password</label>
                                <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm password" onChange={this.handleChange} />
                            </div>
                            {this.state.errorMsg && <div className="alert alert-danger" role="alert">{this.state.errorMsg}</div>}
                            <button className="btn btn-primary" onClick={this.handleSubmit}>Reset password</button>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps)(ResetPasswordComponent);