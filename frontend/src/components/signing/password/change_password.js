import React, { Component, Fragment } from 'react';
import { DropdownItem, Modal, ModalBody, ModalFooter, Button } from 'reactstrap';
import Axios from 'axios';
import { SERVER } from '../../../config';
import { connect } from 'react-redux';

class ChangePassword extends Component {

    state = {
        modal: false,
        message: '',
        spinner: false
    }

    toggle = () => {
        this.setState({ modal: !this.state.modal, message: '' });
    }

    spinnerToggle = () => {
        this.setState({ spinner: !this.state.spinner });
    }

    handleChangePassword = () => {
        this.spinnerToggle();
        this.toggle();
        Axios.post(SERVER + '/send_pwreset_email', {
            email: this.props.auth.user.email
        }).then(({ data }) => {
            const { status, message } = data;
            if (status) {
                this.spinnerToggle();
                this.setState({ message });
            } else {
                console.log('error occured on status: false');
            }
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <Fragment>
                <DropdownItem onClick={this.handleChangePassword}>
                    Change Password
                </DropdownItem>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalBody>
                        <div className={`spinner-border mx-auto ${this.state.spinner ? 'd-block' : 'd-none'}`} role="status">
                        </div>
                        <h4>{this.state.message}</h4>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="button" color="secondary right-float" onClick={this.toggle}>Close</Button>
                    </ModalFooter>
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

export default connect(mapStateToProps)(ChangePassword);