import React from 'react';

const Form = ({ handleChange, auth, next }) => {

    return (
        <form onChange={handleChange}>
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
            <button type="submit" className="btn btn-primary mb-2" onClick={next}>Edit profile</button>
        </form>
    );
}

export default Form;