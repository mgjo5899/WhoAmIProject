import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

class SignedInNotConfirmedHome extends Component {
    state = {
        message: '',
    }

    handleResend = e => {
        console.log(this.props.auth);
        axios.post('http://localhost:8000/resend', {
            email: this.props.auth.user.email
        }).then(res => res.data)
            .then(data => {
                const { message } = data;
                this.setState({ message });
            }).catch(err => {
                console.log(err)
            });
    }

    render() {
        return (
            <div className="col-sm-6">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">You have not verified your email</h5>
                        <p className="card-text">Click the button below to receive new verification email</p>
                        <button type="button" onClick={this.handleResend} className="btn btn-primary">Resend</button>
                        {this.state.message && <div className="alert alert-primary mt-3" role="alert">{this.state.message}</div>}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps)(SignedInNotConfirmedHome);