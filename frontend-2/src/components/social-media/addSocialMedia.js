import React, { Component, Fragment } from 'react';
import { Modal, ModalHeader } from 'reactstrap';
import axios from 'axios';
import { SERVER, CODE_REDIRECT_URI } from '../../config';
import { connect } from 'react-redux';
import { ModalFooter, Button, ModalBody } from 'reactstrap';

class AddSocialMedia extends Component {

    state = {
        modal: false,
        message: '',
        spinner: false,
        registerModal: false,
        sns: [
            {
                name: 'Instagram',
                link: '/instagram/register',
                clientId: 'c8fdd62c5cdd4b26a25c13f98b222e08',
                clientSecret: 'ab7c144fa18a467a97300c6377d1e364',
                authURL: (clientId) => `https://api.instagram.com/oauth/authorize/?client_id=${clientId}&redirect_uri=${CODE_REDIRECT_URI}&response_type=code`
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

    handleRegister = elem => {
        this.spinnerToggle();
        this.registerToggle();
        this.popup(elem);
        axios.post(SERVER + elem.link, {
            username: this.props.auth.user.username
        }).then(res => {
            const { message } = res.data;
            this.spinnerToggle();
            this.setState({ message });
        }).catch(err => {
            console.log(err);
        });
    }

    popup = elem => {
        const [width, height] = [450, 600];
        const [left, top] = [window.screen.width / 2 - width / 2, window.screen.height / 2 - height / 2];
        const spec = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
        const newWindow = window.open(elem.authURL(elem.clientId, SERVER), elem.name, spec);
        window.focus && newWindow.focus();
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
                                        <button onClick={() => this.handleRegister(elem)} className="list-group-item list-group-item-action">{elem.name}</button>
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

export default connect(mapStateToProps)(AddSocialMedia);
