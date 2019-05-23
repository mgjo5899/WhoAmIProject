import React, { Fragment } from 'react';
import Infinite from 'react-infinite';

const FollowingFollowers = ({ next }) => {

    // const [followersInfiniteLoading, setFollowersInfiniteLoading] = useState(false);

    const handleFollowersInfiniteLoad = () => {
        // setFollowersInfiniteLoading(true);
        console.log('printing followers')
        // setTimeout(() => setFollowersInfiniteLoading(false), 3000);
    }

    const handleFollowingInfiniteLoad = () => {
        // setFollowersInfiniteLoading(true);
        console.log('printing following')
        // setTimeout(() => setFollowersInfiniteLoading(false), 3000);
    }

    return (
        <Fragment>
            <div className="row">
                <div className="col-sm-6 border-right">
                    <h5>Followers</h5>
                    <div className="card p-2 followers">
                        <Infinite
                            containerHeight={500}
                            elementHeight={100}
                            infiniteLoadBeginEdgeOffset={200}
                            onInfiniteLoad={handleFollowersInfiniteLoad}
                        >
                            <div style={{ height: 100 }} className="border row m-2">
                                <div className="col-3 border-right p-0">image</div>
                                <div className="col-6 border-right p-0">username</div>
                                <div className="col-3 p-0">
                                    <button className="btn btn-outline-primary d-block w-100 h-50">follow</button>
                                    <button className="btn btn-outline-primary d-block w-100 h-50">following</button>
                                </div>
                            </div>
                            <div style={{ height: 100 }}>Haha</div>
                            <div style={{ height: 100 }}>Haha</div>
                            <div style={{ height: 100 }}>Haha</div>
                            <div style={{ height: 100 }}>Haha</div>
                            <div style={{ height: 100 }}>Haha</div>
                            <div style={{ height: 100 }}>Haha</div>
                            <div style={{ height: 100 }}>Haha</div>
                            <div style={{ height: 100 }}>Haha</div>
                            <div style={{ height: 100 }}>Haha</div>
                            <div style={{ height: 100 }}>Haha</div>
                        </Infinite>
                    </div>
                </div>
                <div className="col-sm-6">
                    <h5>Following</h5>
                    <div className="card followers p-2" style={{ height: 500 }}>
                        <Infinite
                            containerHeight={500}
                            elementHeight={100}
                            infiniteLoadBeginEdgeOffset={200}
                            onInfiniteLoad={handleFollowingInfiniteLoad}
                        >
                            <div style={{ height: 100 }}>Haha</div>
                            <div style={{ height: 100 }}>Haha</div>
                            <div style={{ height: 100 }}>Haha</div>
                            <div style={{ height: 100 }}>Haha</div>
                            <div style={{ height: 100 }}>Haha</div>
                            <div style={{ height: 100 }}>Haha</div>
                            <div style={{ height: 100 }}>Haha</div>
                            <div style={{ height: 100 }}>Haha</div>
                            <div style={{ height: 100 }}>Haha</div>
                            <div style={{ height: 100 }}>Haha</div>
                            <div style={{ height: 100 }}>Haha</div>
                        </Infinite>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-center mt-3">
                <button type="submit" className="btn btn-primary m-2">save</button>
                <button type="button" className="btn btn-primary m-2" onClick={next}>publish</button>
            </div>
        </Fragment>
    );
}

export default FollowingFollowers;