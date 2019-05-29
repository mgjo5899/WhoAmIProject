import React, { Fragment, useEffect, useState } from 'react';
import Infinite from 'react-infinite';
import { getFollowersFollowingUsers } from '../../store/actions/data_actions';
import { SECRET_KEY, SERVER } from '../../config';
import Axios from 'axios';
import AnonymousUser from '../../images/anonymous/anonymous_user.png';


const FollowingFollowers = ({ next, activeIndex, contentsIndex }) => {

    const [followersList, setFollowersList] = useState([]);
    const [followingUsersList, setFollowingUsersList] = useState([]);

    useEffect(() => {
        // if active index matches with contents index
        if (activeIndex === contentsIndex.following_followers) {
            setUpFollowersFollwingUsers();
        }
    }, []);

    const setUpFollowersFollwingUsers = async () => {
        try {
            // from data action file, get followers and following users to use
            const { followers, followingUsers } = await getFollowersFollowingUsers();
            // make axios call
            const followersProfileImages = (await Axios.post(SERVER + '/user/follow_relationships', {
                secret_key: SECRET_KEY,
                usernames: followers
            })).data;
            // handle if status is false
            if (!followersProfileImages.status) throw new Error(followersProfileImages.message);
            setFollowersList([...followersProfileImages.follow_relationships]);
            // do same stuff for following users
            // from data action file, get followers and following users to use
            // make axios call
            const followingUsersProfileImages = (await Axios.post(SERVER + '/user/follow_relationships', {
                secret_key: SECRET_KEY,
                usernames: followingUsers
            })).data;
            // handle if status is false
            if (!followingUsersProfileImages.status) throw new Error(followingUsersProfileImages.message);
            setFollowingUsersList([...followingUsersProfileImages.follow_relationships]);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        console.log(followingUsersList, followersList);
    }, [followingUsersList, followersList])

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

    const followersFollowingUsersRender = followList => (
        followList.map((follow, index) => (
            <div key={index} style={{ height: 100 }} className="border row m-2">
                <div className="col-3 p-0">
                    <img className="m-2 rounded-circle" src={follow.profile_image_url ? follow.profile_image_url : AnonymousUser} style={{ height: 80 }} alt="" />
                </div>
                <div className="col-6 p-0 text-center my-auto" style={{ fontSize: 30 }}>{follow.username}</div>
                <div className="col-3 p-0 h-50 my-auto">
                    <button className={"btn d-block float-right mr-2 border" + (follow.following ? ' btn-light' : ' btn-primary')} onClick={() => handleFollowUnfollow(follow)}>
                        {follow.following ? 'following' : 'follow'}
                    </button>
                </div>
            </div>
        ))
    );

    // combine two functions into one
    const handleFollowUnfollow = async user => {
        // if user is not following
        try {
            if (!user.following) {
                await handleFollowUser(user);
            } else {
                await handleUnfollowUser(user);
            }
            setUpFollowersFollwingUsers();
        } catch (error) {
            console.log(error);
        }
    }

    const handleFollowUser = async user => {
        // if it is currently not following, follow the user
        const { status, message } = (await Axios.post(SERVER + '/user/following_users', {
            followed_user_username: user.username
        })).data;
        // if status is false, throw error to print to console output
        if (!status) throw new Error(message);
        user.following = true;
    }

    const handleUnfollowUser = async user => {
        // if it is currently not following, follow the user
        const { status, message } = (await Axios.delete(SERVER + '/user/following_users', {
            data: {
                followed_user_username: user.username
            }
        })).data;
        // if status is false, throw error to print to console output
        if (!status) throw new Error(message);
        user.following = false;
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
                            {followersFollowingUsersRender(followersList)}
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
                            {followersFollowingUsersRender(followingUsersList)}
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