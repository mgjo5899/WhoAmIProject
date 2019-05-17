import React, { Fragment, useEffect, useState } from 'react';
import Navbar from '../layout/navbar';
import Profile from '../profile/profile';
import Follow from '../follow/follow';
import ChangePassword from '../signing/password/change_password';

const Setting = () => {

    const [currentTab, setCurrentTab] = useState('profile');
    const [navList, setNavList] = useState(null);
    const [componentRender, setComponentRender] = useState(null);

    useEffect(() => {
        const idMap = {
            profile: {
                name: 'Profile',
                component: <Profile />
            },
            follow: {
                name: 'Followers / Following',
                component: <Follow />
            },
            'change-password': {
                name: 'Change password',
                component: <ChangePassword />
            }
        }
        setNavList([]);
        for (const id in idMap) {
            setNavList(navList =>
                [...navList, <button id={id} key={id} className={"btn btn-lg btn-link nav-link m-2" + (id === currentTab ? ' active' : '')}>{idMap[id].name}</button>]
            );
        }
        setComponentRender(idMap[currentTab].component);
    }, [currentTab]);

    return (
        <Fragment>
            <Navbar />
            <div className="side-bar float-left mx-3 border-right p-3">
                <div className="nav flex-column nav-pills" onClick={e => setCurrentTab(e.target.id)}>
                    {navList}
                </div>
            </div>
            <div className="container">
                {componentRender}
            </div>
        </Fragment>
    );
}

export default Setting;