import React, { Fragment, useEffect } from 'react';

const InputForm = ({ auth, readOnly, profile, next }) => {

    useEffect(() => {
        if (readOnly) {
            ['show-email', 'hide-email', 'email', 'upload-button'].forEach(email => {
                document.getElementById(email).parentElement.style.display = 'none';
            })
            for (const key in profile) {
                const element = document.getElementById(key);
                console.log(key, element)
                if (key === 'profile_image_url') {
                    const profileElement = document.getElementById('profile-image');
                    profileElement.parentElement.style.display = 'block';
                    profileElement.parentElement.src = profile[key];
                    document.getElementById('upload-button').style.display = 'none';
                } else if (element) {
                    element.parentElement.style.display = 'none';
                    if (profile[key]) {
                        element.parentElement.style.display = 'block';
                        element.value = profile[key];
                        element.readOnly = true;
                    }
                }
            }
        }
    }, []);

    useEffect(() => {
        console.log(profile)
    }, [profile])

    return (
        <Fragment>
            <div className="form-group">
                {
                    profile.profile_image_url && (
                        <img id="profile-image" src={profile.profile_image_url} alt="" className="img-thumbnail m-2 d-block mx-auto" style={{ width: 200, height: 'auto' }} />
                    )
                }
                <button type="button" id="upload-button" className="btn btn-primary" onClick={next}>Upload photo</button>
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
            <div className="custom-control custom-radio custom-control-inline">
                <input type="radio" id="show-email" name="email-checked" className="custom-control-input" defaultChecked={profile.include_email ? true : undefined} />
                <label className="custom-control-label" htmlFor="show-email">Show email</label>
            </div>
            <div className="custom-control custom-radio custom-control-inline">
                <input type="radio" id="hide-email" name="email-checked" className="custom-control-input" defaultChecked={!profile.include_email ? true : undefined} />
                <label className="custom-control-label" htmlFor="hide-email">Hide email</label>
            </div>
            <div className="form-group">
                <h5 htmlFor="website">Website</h5>
                {readOnly ? <p id="website">{profile.website}</p> : <input type="text" className="form-control" id="website" placeholder="Website" />}
            </div>
        </Fragment>
    );
}

export default InputForm;