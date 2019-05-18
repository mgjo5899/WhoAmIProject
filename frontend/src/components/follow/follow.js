import React from 'react';

const Follow = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-6 border-right">
                    <h5>Followers</h5>
                    <div className="card followers" style={{ height: 500 }}>
                        <h1 className="mx-auto my-auto">Followers</h1>
                    </div>
                </div>
                <div className="col-sm-6">
                    <h5>Following</h5>
                    <div className="card followers" style={{ height: 500 }}>
                        <h1 className="mx-auto my-auto">Following</h1>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-center mt-3">
                <button type="submit" className="btn btn-primary m-2">save</button>
                <button type="button" className="btn btn-primary m-2">publish</button>
            </div>
        </div>
    );
}

export default Follow;