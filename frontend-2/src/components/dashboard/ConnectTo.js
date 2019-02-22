import React, { useState, useEffect } from 'react';
import InstagramLogo from '../../images/instagram/instagram-logo.png';
import Axios from 'axios';
import { SERVER } from '../../config';

const ConnectTo = ({ previous, pickedElement, next }) => {

    const [socialMedia, setSocialMedia] = useState([
        {
            medium: 'instagram',
            link: '/instagram/user_data',
            clientId: 'c8fdd62c5cdd4b26a25c13f98b222e08',
            clientSecret: 'ab7c144fa18a467a97300c6377d1e364 ',
            authRedirectUri: 'http://localhost:8000/instagram/get_access_token',
            authURL: (clientId, authRedirectUri) => `https://api.instagram.com/oauth/authorize/?client_id=${clientId}&redirect_uri=${authRedirectUri}&response_type=code`,
            src: InstagramLogo,
            authorized: false
        }
    ]);

    useEffect(() => {
        checkAuthorizedSocialMedia();
    }, []);

    const checkAuthorizedSocialMedia = async () => {
        const data = await (await Axios.get(SERVER + '/user/authorized_media')).data;
        if (data.status) {
            data.authorized_medium.forEach(auth_obj => {    //iterate through given data
                const index = socialMedia.findIndex(obj => obj.medium === auth_obj.medium); // iterate to find index of same medium
                index !== -1 && (socialMedia[index].authorized = true); // if it finds the index, then make that thing into true
                setSocialMedia(socialMedia);
            });
        }
    }

    const handleRegister = elem => {
        // check if it is enabled or not. If not, call popup first, if it is, skip it
        if (!elem.authorized) {
            const newWindow = popup(elem);    // only if it is disabled
            newWindow.onunload = () => {
                // call api for the color
                pickedElement(elem);
                return;
            }
        }
        pickedElement(elem);    // pick the element what I have selected
    }

    const popup = elem => {
        const [width, height] = [450, 600];
        const [left, top] = [window.screen.width / 2 - width / 2, window.screen.height / 2 - height / 2];
        const spec = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
        const newWindow = window.open(elem.authURL(elem.clientId, elem.authRedirectUri), elem.medium, spec);
        window.focus && newWindow.focus();
        return newWindow;
    }

    return (
        <div className="card text-center">
            <h5 className="card-header">
                Connect To
             </h5>
            <div className="card-body">
                <div className="list-group row">
                    {
                        socialMedia.map(elem => (
                            <div className="mx-auto col-sm-10 m-2 text-center" key={elem.medium}>
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
