import React, { Fragment } from 'react';

const Spread = ({ next, previous, imageSelected, setImageSelected }) => {
    return (
        <Fragment>
            <div className="card justify-content-center align-self-stretch m-2" style={{ height: '80vh' }}></div>
            <hr />
            <div className="card-footer d-flex justify-content-center">
                <button className="btn btn-danger mx-auto" onClick={previous}>Cancel</button>
                <button className="btn btn-primary mx-auto" onClick={() => { next(); setImageSelected([]); }}>Publish</button>
            </div>
        </Fragment>
    );
}

export default Spread;