import React, { Fragment } from 'react';
import Axios from 'axios';
import { SECRET_KEY, SERVER, DEFAULT_PROFILE_FONT_SIZE, DEFAULT_PROFILE_SIZE_VALUE, SOCIAL_MEDIA_CONFIG } from '../../config';

export const resetData = () => ({
    type: 'RESET_DATA'
})

export const setData = data => ({
    type: 'SET_DATA',
    data
})

// showing the images to the end users
/**
 * 
 * @param {list} imageData - image data to show up
 * @param {function} clickFunc - operate function when click
 * @param {int} flag - 0 ==> dashboard 1 ==> image spread 2 ==> profile spread
 */
export const showImages = (imageData, clickFunc, flag) => {
    console.log(SOCIAL_MEDIA_CONFIG)
    return imageData.map((image, index) => {

        let className = 'card position-absolute rounded';

        const correctFlag = (flag === 1 && image.medium !== 'whoami') || (flag === 2 && image.type === 'profile');

        if ([1, 2].includes(flag)) {
            className += ' draggable resize-drag';
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
                    transform: `translate(${image.posX || image.pos_x}px, ${image.posY || image.pos_y}px)`,
                }}
                data-x={image.posX || image.pos_x}
                data-y={image.posY || image.pos_y}
                onClick={flag === 0 ? (() => clickFunc(image)) : undefined}
            >
                {
                    image.type !== 'profile'
                        ? (
                            <Fragment>
                                <img
                                    className="w-100 h-100"
                                    src={image.src || image.specifics.raw_content_url}
                                    alt=""
                                />
                                <img className="position-absolute" alt="" src={SOCIAL_MEDIA_CONFIG.find(socialMedia => socialMedia.medium === image.medium).logo} style={{ width: '10%', top: '2%', left: '2%', opacity: 0.7 }} />
                            </Fragment>
                        )
                        : (
                            <span id="profile" className="card" style={{ fontSize: DEFAULT_PROFILE_FONT_SIZE * image.specifics.curr_width / DEFAULT_PROFILE_SIZE_VALUE, userSelect: 'none' }}>
                                profile
                            </span>
                        )
                }
                {correctFlag && (
                    <button type="button" onClick={() => clickFunc(image)} className="close position-absolute" style={{ top: '2%', right: '2%' }} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                )}
            </div>
        )
    })
}

export const isOwner = (auth, username) => (auth.user.username === username)

export const getExistingImages = (auth, username, history) => async dispatch => {
    try {
        return isOwner(auth, username) ? await dispatch(getOwnerExistingImages()) : await dispatch(getUserExistingImages(username));
    } catch (error) {
        history.push('/error_page');
        console.log(error);
    }
}

const getOwnerExistingImages = () => async dispatch => {
    const data = (await Axios.get(SERVER + '/whiteboard/user_data')).data;
    console.log(data)
    const { status, whiteboard_data, message } = data;
    if (!status) throw new Error(message);
    dispatch(resetData());
    dispatch(setData({
        existing: whiteboard_data
    }));
}

const getUserExistingImages = username => async dispatch => {
    const { status, whiteboard_data, message } = (await Axios.post(SERVER + '/whiteboard/published_data', {
        username,
        secret_key: SECRET_KEY
    })).data;
    if (!status) throw new Error(message);
    dispatch(resetData());
    dispatch(setData({
        existing: whiteboard_data
    }));
}