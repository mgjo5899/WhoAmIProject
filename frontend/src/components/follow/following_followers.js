import React, { Fragment } from 'react';
import FollowingFollowersDisplay from './following_followers_display';


const FollowingFollowers = ({ next, activeIndex, contentsIndex, auth, username }) => {

    return (
        <Fragment>
            <FollowingFollowersDisplay {...{ activeIndex, contentsIndex, auth, username }} />
            <div className="d-flex justify-content-center mt-3">
                <button type="submit" className="btn btn-primary m-2">save</button>
                <button type="button" className="btn btn-primary m-2" onClick={next}>publish</button>
            </div>
        </Fragment>
    );
}

export default FollowingFollowers;