import React, { Fragment, useEffect } from 'react'
import { connect } from 'react-redux';
import { SignedInConfirmedHome, SignedInNotConfirmedHome, NotSignedInHome } from './signed_home';
import Navbar from '../layout/navbar';
import { resetActiveIndex } from '../../store/actions/carousel_actions';
import { resetData } from '../../store/actions/data_actions';


const Home = ({ resetActiveIndex, resetData, data, auth: { user }, carousel }) => {

    useEffect(() => {
        resetActiveIndex('DASHBOARD');
        resetActiveIndex('PROFILE');
        // resetData();
        console.log(data, carousel)
    }, [])

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

const mapStateToProps = state => ({
    auth: state.auth,
    data: state.data,
    carousel: state.carousel
})

const mapDispatchToProps = dispatch => ({
    resetActiveIndex: activeIndexFlag => dispatch(resetActiveIndex(activeIndexFlag)),
    resetData: () => dispatch(resetData())
})

export default connect(mapStateToProps, mapDispatchToProps)(Home);