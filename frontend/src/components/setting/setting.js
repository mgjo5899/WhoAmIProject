import React, { Fragment, useEffect, useState } from 'react';
import Navbar from '../layout/navbar';
import Profile from '../profile/profile';
import Follow from '../follow/follow';
import ChangePassword from '../signing/password/change_password';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import signedInSecure from '../../secure/signed_in_secure';
import queryString from 'query-string';
import { showImages } from '../../store/actions/data_actions';

const Setting = ({ auth, history, location }) => {

    const [images, setImages] = useState([]);

    useEffect(() => {
        signedInSecure({ auth, history }, '/');
        // for the responsive view, get the element of container
    }, []);

    const idMap = {
        'nav-profile': {
            name: 'Profile'
        },
        'nav-follow': {
            name: 'Follow',
            tab: 'follow'
        },
        'nav-change-password': {
            name: 'Change password',
            tab: 'change_password'
        }
    }
    let navList = [];
    const { tab } = queryString.parse(location.search);
    for (const id in idMap) {
        navList.push(
            <Link
                id={id}
                key={id}
                className={'nav-link' + (tab === idMap[id].tab ? ' active' : '')}
                to={'/setting' + (idMap[id].tab ? '?tab=' + idMap[id].tab : '')}
            >
                {idMap[id].name}
            </Link>
        );
    }

    const componentMap = tab => {
        if (tab === 'follow') {
            return <Follow auth={auth} images={images} setImages={setImages} />;
        } else if (tab === 'change_password') {
            return <ChangePassword />;
        } else {
            return <Profile showImages={showImages} auth={auth} images={images} setImages={setImages} />;
        }
    }

    return (
        <Fragment>
            <Navbar />
            <div id="main-container" className="container-fluid">
                <div className="row">
                    <div className="side-bar col-sm-2 mx-2 border-right p-2">
                        <div className="nav flex-column nav-pills">
                            {navList}
                        </div>
                    </div>
                    <div className="col-sm-9">
                        {componentMap(tab)}
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

const mapStateToProps = state => ({
    auth: state.auth,
})

export default withRouter(connect(mapStateToProps, null)(Setting));