import React, { useState, Fragment } from 'react';
import Axios from 'axios';
import { SERVER } from '../../config';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';

const Form = ({ profileData, setProfileData, auth, next }) => {

    const [modal, setModal] = useState(false);

    const [message, setMessage] = useState('');

    const toggle = () => {
        setModal(!modal);
    }

    const handleSave = async e => {
        e.preventDefault();
        try {
            const { status, message } = (await Axios.post(SERVER + '/user/profile', profileData)).data;
            if (!status) throw new Error(message);
            setMessage(message);
            toggle();
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = e => {
        e.persist();
        setProfileData(profileData => ({
            ...profileData,
            [e.target.id]: e.target.value
        }));
    }

    return (
        <Fragment>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalBody>
                    <h5>{message}</h5>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-primary" onClick={toggle}>Confirm</button>
                </ModalFooter>
            </Modal>
            <form id="profile-form" className="w-50 mx-auto" onChange={handleChange}>
                <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea className="form-control" id="bio" placeholder="Bio" />
                </div>
                <div className="form-group">
                    <label htmlFor="company">Company</label>
                    <input type="text" className="form-control" id="company" placeholder="Company" />
                </div>
                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input type="text" className="form-control" id="location" placeholder="Location" />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" id="email" readOnly value={auth.user.email} />
                </div>
                <div className="form-group">
                    <label htmlFor="website">Website</label>
                    <input type="text" className="form-control" id="website" placeholder="Website" />
                </div>
                <button type="submit" className="btn btn-primary m-2" onClick={handleSave}>Save</button>
                <button type="button" className="btn btn-primary m-2" onClick={next}>Spread profile</button>
            </form>
        </Fragment>
    );
}

export default Form;