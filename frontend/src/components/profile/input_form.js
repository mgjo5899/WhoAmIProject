import React, { useEffect } from 'react';
import AnonymousUser from '../../images/anonymous/anonymous_user.png';
import { DEFAULT_PROFILE_SIZE_VALUE } from '../../config';
import { UncontrolledTooltip } from 'reactstrap';

const InputForm = ({ auth, readOnly, profile, next, setProfile }) => {

    useEffect(() => {
        if (readOnly) {
            const formChildren = document.getElementById('input-form').children;
            for (let i = 1; i < formChildren.length; i++) {
                formChildren[i].style.display = 'none';
            }
            for (const key in profile) {
                const element = document.getElementById(key);
                if (element) {
                    element.parentElement.style.display = 'block';
                    element.value = profile[key];
                    element.readOnly = true;
                }
            }
        }
    }, []);
    return (
        <div id="input-form">
            <div className="form-group">
                <div className="d-flex justify-content-center">
                    <div className="position-relative">
                        <img
                            id="profile-image"
                            src={profile.profile_image_url ? profile.profile_image_url : AnonymousUser}
                            alt=""
                            className="img-thumbnail mx-auto rounded-circle"
                            onClick={!readOnly ? next : undefined}
                            style={{ width: DEFAULT_PROFILE_SIZE_VALUE, height: DEFAULT_PROFILE_SIZE_VALUE, objectFit: 'cover' }}
                        />
                        {
                            !readOnly && (
                                <UncontrolledTooltip placement="right" target="profile-image">
                                    Click to select profile image
                                </UncontrolledTooltip>
                            )
                        }
                        {
                            profile.profile_image_url && !readOnly && (
                                <button type="button" onClick={() => setProfile({ ...profile, profile_image_url: '' })} className="close position-absolute" style={{ top: '2%', right: '2%' }} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            )
                        }
                    </div>
                </div>
                {/* <button type="button" id="upload-button" className="btn btn-primary" onClick={next}>Upload photo</button> */}
            </div>
            <div className="form-group">
                <h5 htmlFor="bio">Bio</h5>
                {readOnly ? <p id="bio">{profile.bio}</p> : <input type="text" className="form-control" id="bio" placeholder="Bio" />}
            </div>
            <div className="form-group">
                <h5 htmlFor="company">Company</h5>
                {readOnly ? <p id="company">{profile.company}</p> : <input type="text" className="form-control" id="company" placeholder="Company" />}
            </div>
            <div className="form-group">
                <h5 htmlFor="location">Location</h5>
                {readOnly ? <p id="location">{profile.location}</p> : <input type="text" className="form-control" id="location" placeholder="Location" />}
            </div>
            <div className="form-group">
                <h5 htmlFor="email">Email</h5>
                {readOnly ? <p id="email">{profile.email}</p> : <input type="text" className="form-control" id="email" readOnly value={auth.user.email} />}
            </div>
            <div className="mb-2">
                <div className="custom-control custom-radio custom-control-inline">
                    <input type="radio" id="show-email" name="email-checked" className="custom-control-input" defaultChecked={profile.include_email ? true : undefined} />
                    <label className="custom-control-label" htmlFor="show-email">Show email</label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                    <input type="radio" id="hide-email" name="email-checked" className="custom-control-input" defaultChecked={!profile.include_email ? true : undefined} />
                    <label className="custom-control-label" htmlFor="hide-email">Hide email</label>
                </div>
            </div>
            <div className="form-group">
                <h5 htmlFor="website">Website</h5>
                {readOnly ? <button className="btn btn-link m-0 p-0" id="website" onClick={() => window.open(profile.website)}>{profile.website}</button> : <input type="text" className="form-control" id="website" placeholder="Website" />}
            </div>
        </div>
    );
}

export default InputForm;