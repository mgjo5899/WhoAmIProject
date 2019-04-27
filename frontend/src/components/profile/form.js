import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { SERVER } from '../../config';

const Form = ({ profile, setProfile, auth, next }) => {

    const [filled, setFilled] = useState(false);

    useEffect(() => {
        if (!filled) {
            setExistingProfileData()
                .then(() => {
                    const formDOM = document.getElementById('profile-form');
                    console.log(formDOM);
                    setFilled(true);
                });
        }
    }, [profile.data]);

    const handleSave = async e => {
        e.preventDefault();
        console.log(profile)
        try {
            const { status, message } = (await Axios.post(SERVER + '/user/profile', profile.data)).data;
            if (!status) throw new Error(message);
        } catch (error) {
            console.log(error);
        }
    }

    const setExistingProfileData = async () => {
        const profileData = (await Axios.get(SERVER + '/user/profile')).data;
        setProfile(profile => ({
            ...profile,
            data: {
                ...profile.data,
                ...profileData.profile
            }
        }));
    }

    const handleChange = e => {
        e.persist();
        setProfile(profile => ({
            ...profile,
            data: {
                ...profile.data,
                [e.target.id]: e.target.value
            }
        }));
    }

    return (
        <form id="profile-form" onChange={handleChange}>
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
            <button type="submit" className="btn btn-primary m-2" onClick={next}>Spread profile</button>
        </form>
    );
}

export default Form;