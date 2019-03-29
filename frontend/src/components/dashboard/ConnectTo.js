import React, { useState, useEffect } from 'react';
import InstagramLogo from '../../images/instagram/instagram-logo.png';
import FacebookLogo from '../../images/facebook/facebook-logo.png';
import Axios from 'axios';
import { SERVER } from '../../config';

const ConnectTo = ({ previous, setElement, activeIndex, contentsIndex, next }) => {

    const [socialMedia, setSocialMedia] = useState([
        {
            medium: 'instagram',
            link: '/instagram/user_data',
            clientId: 'c8fdd62c5cdd4b26a25c13f98b222e08',
            authRedirectUri: 'http://localhost:8000/instagram/get_access_token',
            authURL: (clientId, authRedirectUri) => `https://api.instagram.com/oauth/authorize/?client_id=${clientId}&redirect_uri=${authRedirectUri}&response_type=code`,
            src: InstagramLogo,
            authorized: false,
            contents: 'instagram_contents',
            sourceUrl: 'instagram_url',
            specific: 'instagram_specific'
        },
        {
            medium: 'facebook',
            link: '/facebook/user_data',
            clientId: '1050432755165601',
            authRedirectUri: 'http://localhost:8000/facebook/get_access_token',
            authURL: (clientId, authRedirectUri) => `https://www.facebook.com/v3.2/dialog/oauth?client_id=${clientId}&redirect_uri=${authRedirectUri}&state=gnsalswjddma&scope=user_photos`,
            src: FacebookLogo,
            authorized: false,
            contents: 'facebook_contents',
            sourceUrl: 'facebook_url',
            specific: 'facebook_specific'
        }
    ]);

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
                    setSocialMedia(socialMedia => {
                        // iterate to find same medium
                        let newSocialMedia = [...socialMedia];
                        const media = newSocialMedia.find(obj => obj.medium === auth_obj.medium);
                        if (media) media.authorized = true;
                        return newSocialMedia;
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
