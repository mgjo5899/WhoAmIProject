import React, { Component, Fragment } from 'react';
import { Modal, ModalHeader } from 'reactstrap';
import axios from 'axios';
import { SERVER } from '../../config';
import { connect } from 'react-redux';
import { ModalFooter, Button, ModalBody } from 'reactstrap';

class AddSNS extends Component {

    state = {
        modal: false,
        message: '',
        spinner: false,
        registerModal: false,
        sns: [
            {
                name: 'Instagram',
                link: '/instagram/register'
            }
        ]
    }

    toggle = () => {
        this.setState({ modal: !this.state.modal, message: '' });
    }

    registerToggle = () => {
        this.setState({ registerModal: !this.state.registerModal, message: '' });
    }

    spinnerToggle = () => {
        this.setState({ spinner: !this.state.spinner });
    }

    handleRegister = link => {
        this.spinnerToggle();
        this.registerToggle();
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
                <svg onClick={this.toggle} id="i-plus" className="shadow-lg text-dark bg-primary rounded-circle" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                    <path d="M16 2 L16 30 M2 16 L30 16" />
                </svg>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Select SNS to add</ModalHeader>
                    <div className="container">
                        <div className="list-group row">
                            {
                                this.state.sns.map(elem => (
                                    <div className="mx-auto col-sm-10 m-2 text-center" key={elem.name}>
                                        <button onClick={() => this.handleRegister(elem.link)} className="list-group-item list-group-item-action">{elem.name}</button>
                                    </div>)
                                )
                            }
                            {/* <button type="button" class="list-group-item list-group-item-action active">
                            Cras justo odio
                        </button>
                        <button type="button" class="list-group-item list-group-item-action">Dapibus ac facilisis in</button>
                        <button type="button" class="list-group-item list-group-item-action">Morbi leo risus</button>
                        <button type="button" class="list-group-item list-group-item-action">Porta ac consectetur ac</button>
                        <button type="button" class="list-group-item list-group-item-action" disabled>Vestibulum at eros</button> */}
                        </div>
                    </div>
                    <ModalFooter>
                        <button type="button" className="mx-auto btn btn-secondary" onClick={this.toggle}>Close</button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.registerModal} toggle={this.registerToggle}>
                    <ModalBody>
                        <ModalBody>
                            <div className={`spinner-border mx-auto ${this.state.spinner ? 'd-block' : 'd-none'}`} role="status">
                            </div>
                            <h4>{this.state.message}</h4>
                        </ModalBody>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="mx-auto" color="secondary" onClick={this.registerToggle}>Close</Button>
                    </ModalFooter>
                </Modal>
            </Fragment >
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps)(AddSNS);