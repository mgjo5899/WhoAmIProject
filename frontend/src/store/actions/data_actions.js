import React, { Fragment } from 'react';
import Axios from 'axios';
import { SERVER, DEFAULT_PROFILE_FONT_SIZE, DEFAULT_PROFILE_SIZE_VALUE, SOCIAL_MEDIA_CONFIG } from '../../config';

// showing the images to the end users
/**
 * 
 * @param {list} imageData - image data to show up
 * @param {function} clickFunc - operate function when click
 * @param {int} flag - 0 ==> dashboard 1 ==> image spread 2 ==> profile spread 3 ==> follow spread
 */
export const showImages = async (imageData, clickFunc, flag) => {

    let followersNumber = 0;
    let followingNumber = 0;

    try {
        const followersData = (await Axios.get(SERVER + '/user/followers')).data;
        if (!followersData.status) throw new Error(followersData.message);
        followersNumber = followersData.followers.length;
        const followingData = (await Axios.get(SERVER + '/user/following_users')).data;
        if (!followingData.status) throw new Error(followingData.message);
        followingNumber = followingData.following_users.length;
    } catch (error) {
        console.log(error);
    }

    return imageData.map((image, index) => {

        let className = 'position-absolute rounded';

        // const correctFlag = (flag === 1 && image.medium !== 'whoami') || (flag === 2 && image.type === 'profile');

        if ([1, 2, 3].includes(flag)) {
            className += ' draggable resize-drag';
        }

        const componentMap = {
            profile: (
                <span className="mx-auto" style={{ fontSize: DEFAULT_PROFILE_FONT_SIZE * image.specifics.curr_width / DEFAULT_PROFILE_SIZE_VALUE, userSelect: 'none' }}>
                    profile
                </span>
            ),
            follow: (
                <div style={{ fontSize: 16 * image.specifics.curr_width / DEFAULT_PROFILE_SIZE_VALUE, userSelect: 'none' }}>
                    <div className="float-left text-center" >
                        <div className="followers">
                            followers
                        </div>
                        <div className="followers-number">
                            {followersNumber}
                        </div>
                    </div>
                    <div className="float-right text-center" >
                        <div className="following">
                            following
                        </div>
                        <div className="following-number">
                            {followingNumber}
                        </div>
                    </div>
                </div>
                // <span className="mx-auto" style={{ fontSize: DEFAULT_PROFILE_FONT_SIZE * image.specifics.curr_width / DEFAULT_PROFILE_SIZE_VALUE, userSelect: 'none' }}>
                //     follow
                // </span>
            )
        }

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
                    WebkitTransform: `translate(${image.posX || image.pos_x}px, ${image.posY || image.pos_y}px)`,
                    transform: `translate(${image.posX || image.pos_x}px, ${image.posY || image.pos_y}px)`
                }}
                data-x={image.posX || image.pos_x}
                data-y={image.posY || image.pos_y}
                onClick={flag === 0 ? (() => clickFunc(image)) : undefined}
            >
                {
                    image.medium !== 'whoami'
                        ? (
                            <Fragment>
                                <img
                                    className="w-100 h-100"
                                    src={image.src || image.specifics.raw_content_url}
                                    alt=""
                                />
                                <img className="position-absolute" alt="" src={SOCIAL_MEDIA_CONFIG.find(socialMedia => socialMedia.medium === image.medium).logo} style={{ width: 20, top: '2%', left: '2%', opacity: 0.7 }} />
                            </Fragment>
                        )
                        : (
                            <div className="card pt-3">
                                {componentMap[image.type]}
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