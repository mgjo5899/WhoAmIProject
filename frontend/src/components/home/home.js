import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { SignedInConfirmedHome, SignedInNotConfirmedHome, NotSignedInHome } from './signedHome';
import Navbar from '../layout/navbar';


class Home extends Component {

    render() {
        const { user } = this.props.auth;
        return (
            <Fragment>
                <Navbar />
                <div className="container">
                    {
                        user.email ? user.confirmed ? <SignedInConfirmedHome /> : <SignedInNotConfirmedHome /> : <NotSignedInHome />
                    }
                </div>
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