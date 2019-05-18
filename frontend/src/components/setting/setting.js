import React, { Fragment, useEffect, useState } from 'react';
import Navbar from '../layout/navbar';
import Profile from '../profile/profile';
import Follow from '../follow/follow';
import ChangePassword from '../signing/password/change_password';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import signedInSecure from '../../secure/signed_in_secure';
import { showImages, getExistingImages, setData, updateData, deleteData } from '../../store/actions/data_actions';

const Setting = ({ auth, history, data, setData }) => {

    const [currentTab, setCurrentTab] = useState('nav-profile');
    const [navList, setNavList] = useState(null);
    const [componentRender, setComponentRender] = useState(null);

    const idMap = {
        'nav-profile': {
            name: 'Profile',
            component: <Profile />
        },
        'nav-follow': {
            name: 'Follow',
            component: <Follow
                {...{
                    data,
                    setData,
                    updateData,
                    deleteData,
                    showImages,
                    getExistingImages,
                    auth,
                    history
                }}
            />
        },
        'nav-change-password': {
            name: 'Change password',
            component: <ChangePassword />
        }
    }

    useEffect(() => {
        signedInSecure({ auth, history }, '/');
    }, []);

    useEffect(() => {
        setNavList([]);
        for (const id in idMap) {
            setNavList(navList => [
                ...navList,
                <button
                    id={id}
                    key={id}
                    className={"btn btn-lg btn-link nav-link m-2" + (id === currentTab ? ' active' : '')}
                    onClick={idMap[id].onClick}
                >
                    {idMap[id].name}
                </button>
            ]);
        }
        setComponentRender(idMap[currentTab].component);
    }, [currentTab]);

    return (
        <Fragment>
            <Navbar />
            <div className="container-fluid">
                <div className="row">
                    <div className="side-bar col-sm-2 mx-2 border-right p-2">
                        <div className="nav flex-column nav-pills" onClick={e => e.target.id && setCurrentTab(e.target.id)}>
                            {navList}
                        </div>
                    </div>
                    <div className="col-sm-9">
                        {componentRender}
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

const mapStateToProps = state => ({
    auth: state.auth,
    activeIndex: state.carousel.profileActiveIndex,
    data: state.data,
    profile: state.profile
});

const mapDispatchToProps = dispatch => ({
    getExistingImages: (auth, username, history) => dispatch(getExistingImages(auth, username, history)),
    setData: data => dispatch(setData(data)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Setting));