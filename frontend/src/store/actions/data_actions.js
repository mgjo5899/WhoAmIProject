import React, { Fragment } from 'react';
import Axios from 'axios';
import { SERVER, DEFAULT_PROFILE_FONT_SIZE, DEFAULT_PROFILE_SIZE_VALUE, SECRET_KEY } from '../../config';
import PlayButton from '../../images/playbutton/play-button.png';

// showing the images to the end users
/**
 * 
 * @param {list} imageData - image data to show up
 * @param {function} clickFunc - operate function when click
 * @param {int} flag - 0 ==> dashboard 1 ==> image spread 2 ==> profile spread 3 ==> follow spread
 */
export const showImages = (imageData, clickFunc, flag) => {

    let className = 'position-absolute rounded p-0';
    if ([1, 2, 3].includes(flag)) {
        className += ' draggable resize-drag';
    }

    const componentMap = image => ({
        profile: (
            <span className="mx-auto" style={{ fontSize: DEFAULT_PROFILE_FONT_SIZE * image.specifics.curr_width / DEFAULT_PROFILE_SIZE_VALUE, userSelect: 'none' }}>
                profile
            </span>
        ),
        follow: (
            <div style={{ fontSize: 16 * image.specifics.curr_width / DEFAULT_PROFILE_SIZE_VALUE, userSelect: 'none' }}>
                <div className="float-left text-center ml-2 mb-1" >
                    <div className="followers-number font-weight-bold">
                        {image.specifics.number_of_followers}
                    </div>
                    <div className="followers text-secondary">
                        followers
                    </div>
                </div>
                <div className="float-right text-center mr-2 mb-1" >
                    <div className="following-number font-weight-bold">
                        {image.specifics.number_of_following_users}
                    </div>
                    <div className="following text-secondary">
                        following
                    </div>
                </div>
            </div>
        )
    });

    const onMouseEnterHandle = e => {
        e.currentTarget.play();
    }

    const onMouseLeaveHandle = e => {
        e.currentTarget.pause();
    }

    const imageVideoMap = image => {
        if (image.type === 'image') {
            return (
                <img
                    className="w-100 h-100"
                    src={image.specifics.raw_content_url}
                    alt=""
                />
            )
        } else {
            return (
                <Fragment>
                    <img
                        className="position-absolute mx-auto my-auto"
                        draggable={false}
                        src={PlayButton}
                        style={{ left: 0, right: 0, top: 0, bottom: 0, width: 50, opacity: 0.8, zIndex: 1 }}
                        alt=""
                    />
                    <video
                        id={image.id}
                        className="w-100 h-100"
                        src={image.specifics.raw_content_url}
                        muted={true}
                        onMouseEnter={onMouseEnterHandle}
                        onMouseLeave={onMouseLeaveHandle}
                    />
                </Fragment>
            )
        }
    }

    return imageData.map((image, index) => {

        return (
            <div
                id={image.id}
                medium={image.medium}
                orig_width={image.specifics.orig_width}
                orig_height={image.specifics.orig_height}
                className={className}
                key={index}
                type={image.type}
                style={{
                    width: image.specifics.curr_width || 200,
                    height: 'auto',
                    WebkitTransform: `translate(${image.pos_x}px, ${image.pos_y}px)`,
                    transform: `translate(${image.pos_x}px, ${image.pos_y}px)`
                }}
                data-x={image.pos_x}
                data-y={image.pos_y}
                onClick={flag === 0 ? (() => clickFunc(image)) : undefined}
            >
                {
                    image.medium !== 'whoami'
                        ?
                        imageVideoMap(image)
                        : (
                            <div className="card">
                                {componentMap(image)[image.type]}
                                <span className="position-absolute" style={{ fontSize: 10, width: 50, top: '2%', left: '2%', opacity: 0.7, userSelect: 'none' }}>whoami</span>
                            </div>
                        )
                }
                {flag !== 0 && (
                    <button type="button" onClick={() => clickFunc(image)} className="close position-absolute" style={{ top: '2%', right: '2%' }} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                )}
            </div>
        )
    })
}

export const deleteData = async deleted => {
    try {
        await Axios.delete(SERVER + '/whiteboard/user_data', {
            data: {
                deleted_contents: deleted.map(elem => elem.id)
            }
        });
    } catch (error) {
        console.log(error);
    }
}

export const updateData = async (changed, images) => {
    // put all existing data except delete data
    try {
        await Axios.put(SERVER + '/whiteboard/user_data', {
            updated_contents: images.map(image => ({
                id: image.props.id,
                medium: image.props.medium,
                pos_x: changed[image.props.id].posX,
                pos_y: changed[image.props.id].posY,
                specifics: {
                    curr_width: changed[image.props.id].width,
                    curr_height: changed[image.props.id].height
                }
            }))
        });
    } catch (error) {
        console.log(error);
    }
}

export const getFollowersFollowingUsers = async () => {
    try {
        const followersData = (await Axios.get(SERVER + '/user/followers')).data;
        if (!followersData.status) throw new Error(followersData.message);
        const followers = followersData.followers;
        const followingData = (await Axios.get(SERVER + '/user/following_users')).data;
        if (!followingData.status) throw new Error(followingData.message);
        const followingUsers = followingData.following_users;
        return {
            followers,
            followingUsers
        };
    } catch (error) {
        console.log(error);
    }
}

export const getFollowers = async username => {
    try {
        const { status, message, followers } = (await Axios.post(SERVER + '/utils/get_followers', {
            secret_key: SECRET_KEY,
            username
        })).data;
        if (!status) throw new Error(message);
        return followers;
    } catch (error) {
        console.log(error);
    }
}

export const getFollowingUsers = async username => {
    try {
        const { status, message, following_users } = (await Axios.post(SERVER + '/utils/get_following_users', {
            secret_key: SECRET_KEY,
            username
        })).data;
        if (!status) throw new Error(message);
        return following_users;
    } catch (error) {
        console.log(error);
    }
}