import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { SERVER, SOCIAL_MEDIA_CONFIG as socialMedia } from '../../config';

const ConnectTo = ({ previous, setElement, activeIndex, contentsIndex, next }) => {

    const [authorized, setAuthorized] = useState({
        instagram: false,
        facebook: false
    });

    useEffect(() => {
        // first check for the authorization
        if (activeIndex === contentsIndex.connect_to) {
            checkAuthorizedSocialMedia();
        }
    }, [activeIndex]);

    const checkAuthorizedSocialMedia = async () => {
        try {
            const { status, authorized_medium } = (await Axios.get(SERVER + '/user/authorized_media')).data;
            if (status) {
                //iterate through given data
                authorized_medium.forEach(auth_obj => {
                    setAuthorized({
                        ...authorized,
                        [auth_obj.medium]: true
                    });
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleRegister = elem => {
        // check if it is enabled or not. If not, call popup first, if it is, skip it
        if (!elem.authorized) {
            // only if it is disabled
            // set function globally so that child window can grab parent's function
            window.checkAuthorizedSocialMedia = checkAuthorizedSocialMedia;
            popup(elem);
        } else {
            // already registered, passing element which picked
            setElement(elem);
            next();
        }
    }

    const popup = elem => {
        const [width, height] = [450, 600];
        const [left, top] = [window.screen.width / 2 - width / 2, window.screen.height / 2 - height / 2];
        const spec = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
        const newWindow = window.open(elem.authURL(elem.clientId, elem.authRedirectUri), elem.medium, spec);
        window.focus && newWindow.focus();
    }

    return (
        <div className="card text-center">
            <h5 className="card-header">
                Connect To
             </h5>
            <div className="card-body">
                <div className="list-group row">
                    {
                        socialMedia.map((elem, index) => (
                            <div className="mx-auto col-sm-10 m-2 text-center" key={index}>
                                <button onClick={() => handleRegister(elem)} className="list-group-item list-group-item-action">
                                    <img src={elem.src} alt={elem.medium} className="w-25 h-25" style={!elem.authorized ? { filter: 'grayscale(100%)' } : {}} />
                                </button>
                            </div>)
                        )
                    }
                </div>
            </div>
            <div className="card-footer text-muted">
                <button onClick={previous} className="btn btn-danger mx-auto">Cancel</button>
            </div>
        </div>
    );
}

export default ConnectTo;
