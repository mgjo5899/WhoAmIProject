import React, { useState, Fragment, useEffect } from 'react';
import Axios from 'axios';
import { SERVER } from '../../config';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import InputForm from './input_form';

const Form = ({ profile, setProfile, auth, next, previous }) => {

    const [modal, setModal] = useState(false);
    const [message, setMessage] = useState('');

    const toggle = () => {
        setModal(!modal);
    }

    useEffect(() => {
        const profileForm = document.getElementById('profile-form');
        for (const key in profile) {
            if (profileForm[key]) profileForm[key].value = profile[key];
        }
    }, [profile]);

    const handleSave = async e => {
        e.preventDefault();
        try {
            const { status, message } = (await Axios.post(SERVER + '/user/profile', profile)).data;
            if (!status) throw new Error(message);
            setMessage(message);
            toggle();
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = e => {
        e.persist();
        if (e.target.id === 'show-email') {
            setProfile({
                include_email: true
            });
        } else if (e.target.id === 'hide-email') {
            setProfile({
                include_email: false
            });
        } else {
            setProfile({
                [e.target.id]: e.target.value
            });
        }
    }

    return (
        <Fragment>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalBody>
                    <h5>{message}</h5>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-primary" onClick={toggle}>confirm</button>
                </ModalFooter>
            </Modal>
            <form id="profile-form" className="w-50 mx-auto" onChange={handleChange}>
                <InputForm auth={auth} next={next} profile={profile} setProfile={setProfile} />
                <div className="d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary m-2" onClick={handleSave}>save</button>
                    <button type="button" className="btn btn-primary m-2" onClick={previous}>publish</button>
                </div>
            </form>
        </Fragment>
    );
}

export default Form;