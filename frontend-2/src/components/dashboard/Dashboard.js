import React, { Fragment } from 'react';

const Dashboard = ({ next }) => {
    return (
        <Fragment>
            <div className="d-block">
                <div className="d-flex justify-content-end">
                    <svg id="i-plus" onClick={next} className="m-2 text-dark bg-primary rounded-circle" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                        <path d="M16 2 L16 30 M2 16 L30 16" />
                    </svg>
                </div>
            </div>
            <div className="card justify-content-center align-self-stretch m-2" style={{ height: '80vh' }}>
            </div>
        </Fragment>
    );
}

export default Dashboard;
