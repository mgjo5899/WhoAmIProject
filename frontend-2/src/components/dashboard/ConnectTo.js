import React, { useState } from 'react';


const ConnectTo = ({ previous }) => {

    const [socialMedia, setSocialMedia] = useState([
        {
            name: 'Instagram',
            link: '/instagram/register',
            clientId: '9ace074b44b0414baf402798131f8b00',
            clientSecret: '7491526257d54beeaacd96be2072cf49',
            authURL: (clientId, SERVER) => `https://api.instagram.com/oauth/authorize/?client_id=${clientId}&redirect_uri=${SERVER}&response_type=code`
        }
    ]);

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
                                <button onClick={() => this.handleRegister(elem)} className="list-group-item list-group-item-action">{elem.name}</button>
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
