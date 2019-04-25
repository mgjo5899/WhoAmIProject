import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const SignedInConfirmedHome = ({ auth, history, carousel }) => {

    useEffect(() => {
        history.push('/' + auth.user.username);
    }, []);

    return <Fragment></Fragment>
}

const mapStateToProps = state => ({
    auth: state.auth,
    carousel: state.carousel
})

export default withRouter(connect(mapStateToProps)(SignedInConfirmedHome));