import React, { Fragment } from 'react';
import AddSNS from '../sns/addSNS';


const SignedInConfirmedHome = () => {
    return (
        <Fragment>
            <div className="float-right d-flex">
                <AddSNS />
            </div>
            <h1>Signed In Confirmed</h1>
        </Fragment>
    );
}

export default SignedInConfirmedHome;