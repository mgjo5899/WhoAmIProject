import React, { Component, Fragment } from 'react';
import { DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import Axios from 'axios';
import { SERVER } from '../../config';


class ChangePassword extends Component {
    state = {
        modal: false,
        errorMsg: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    }

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    }

    handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value,
            errorMsg: ''
        });
    }

    handleSubmit = e => {
        e.preventDefault();
        const { oldPassword, newPassword, confirmPassword } = this.state;
        //do check old password after getting api
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

                } else {
                    console.log('something wrong');
                }
            }).catch(err => {
                console.log(err);
            })
        }
    }

    render() {
        return (
            <Fragment>
                <DropdownItem onClick={this.toggle}>
                    Change Password
                </DropdownItem>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <form onSubmit={this.handleSubmit}>
                        <ModalHeader toggle={this.toggle}>Reset password</ModalHeader>
                        <ModalBody>
                            <div className="form-group">
                                <label htmlFor="oldPassword">Old password</label>
                                <input type="password" className="form-control" id="oldPassword" placeholder="Old password" onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="newPassword">New password</label>
                                <input type="password" className="form-control" id="newPassword" placeholder="New password" onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm password</label>
                                <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm password" onChange={this.handleChange} />
                            </div>
                            {this.state.errorMsg && <div className="alert alert-danger" role="alert">{this.state.errorMsg}</div>}
                        </ModalBody>
                        <ModalFooter>
                            <Button type="submit" color="primary col-sm-10">Reset password</Button>{' '}
                            <Button type="button" color="danger col-sm-2" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </Fragment>
        );
    }
}

export default ChangePassword;