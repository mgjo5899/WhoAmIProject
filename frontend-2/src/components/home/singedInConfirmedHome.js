import React, { Fragment } from 'react';
import AddSocialMedia from '../social-media/addSocialMedia';

const SignedInConfirmedHome = () => {
    return (
        <Fragment>
            <div className="float-right d-flex">
                <AddSocialMedia />
            </div>
            <h1>Signed In Confirmed</h1>
        </Fragment>
    );
}

export default SignedInConfirmedHome;