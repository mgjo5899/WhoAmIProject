import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { SignedInConfirmedHome, SignedInNotConfirmedHome, NotSignedInHome } from './signedHome';

class Home extends Component {

    render() {
        const { loaded, signedIn, user: { confirmed } } = this.props.auth;
        return (
            <Fragment>
                {
                    loaded && (signedIn ? confirmed ? <SignedInConfirmedHome /> : <SignedInNotConfirmedHome /> : <NotSignedInHome />)
                }
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps)(Home);