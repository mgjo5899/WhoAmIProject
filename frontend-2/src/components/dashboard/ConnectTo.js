import React, { useState } from 'react';
import InstagramLogo from '../../images/instagram/instagram-logo.png';

const ConnectTo = ({ previous, pickedElement }) => {

    const [socialMedia] = useState([
        {
            name: 'Instagram',
            link: '/instagram/register',
            clientId: 'c8fdd62c5cdd4b26a25c13f98b222e08',
            clientSecret: 'ab7c144fa18a467a97300c6377d1e364 ',
            authRedirectUri: 'http://localhost:8000/instagram/get_access_token',
            authURL: (clientId, authRedirectUri) => `https://api.instagram.com/oauth/authorize/?client_id=${clientId}&redirect_uri=${authRedirectUri}&response_type=code`,
            src: InstagramLogo
        }
    ]);

    const handleRegister = elem => {
        // check if it is enabled or not. If not, call popup first, if it is, skip it
        popup(elem);    // only if it is disabled
        pickedElement(elem);    // pick the element what I have selected
    }

    const popup = elem => {
        const [width, height] = [450, 600];
        const [left, top] = [window.screen.width / 2 - width / 2, window.screen.height / 2 - height / 2];
        const spec = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
        const newWindow = window.open(elem.authURL(elem.clientId, elem.authRedirectUri), elem.name, spec);
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
                        socialMedia.map(elem => (
                            <div className="mx-auto col-sm-10 m-2 text-center" key={elem.name}>
                                <button onClick={() => handleRegister(elem)} className="list-group-item list-group-item-action">
                                    <img src={elem.src} alt={elem.name} className="w-25 h-25" style={{ filter: 'grayscale(100%)' }} />
                                </button>
                            </div>)
                        )
                    }
                    {/* <button type="button" class="list-group-item list-group-item-action active">
                            Cras justo odio
                        </button>
                        <button type="button" class="list-group-item list-group-item-action">Dapibus ac facilisis in</button>
                        <button type="button" class="list-group-item list-group-item-action">Morbi leo risus</button>
                        <button type="button" class="list-group-item list-group-item-action">Porta ac consectetur ac</button>
                        <button type="button" class="list-group-item list-group-item-action" disabled>Vestibulum at eros</button> */}
                </div>
            </div>
            <div className="card-footer text-muted">
                <button onClick={previous} className="btn btn-danger mx-auto">Cancel</button>
            </div>
        </div>
    );
}

export default ConnectTo;
