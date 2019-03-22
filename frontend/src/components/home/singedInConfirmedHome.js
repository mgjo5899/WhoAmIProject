import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const SignedInConfirmedHome = ({ auth, history }) => {

    useEffect(() => {
        history.push('/' + auth.user.username);
    }, []);

    return <Fragment></Fragment>
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default withRouter(connect(mapStateToProps)(SignedInConfirmedHome));