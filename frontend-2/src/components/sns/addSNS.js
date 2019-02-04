import React, { Component, Fragment } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, Modal, ModalBody, ModalFooter, Button } from 'reactstrap';
import Instagram from './instagram';
import axios from 'axios';
import { SERVER } from '../../config';
import { connect } from 'react-redux';




class AddSNS extends Component {

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

    handleRegister = link => {
        this.spinnerToggle();
        this.toggle();
        axios.post(SERVER + link, {
            username: this.props.auth.user.username
        }).then(res => {
            const { message } = res.data;
            this.spinnerToggle();
            this.setState({ message });
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <Fragment>
                <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                        <svg id="i-plus" className="text-dark bg-primary rounded-circle" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                            <path d="M16 2 L16 30 M2 16 L30 16" />
                        </svg>
                    </DropdownToggle>
                    <DropdownMenu right>
                        <Instagram handleRegister={this.handleRegister} />
                    </DropdownMenu>
                </UncontrolledDropdown>
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

export default connect(mapStateToProps)(AddSNS);