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
 * @param {int} flag - 0 ==> dashboard 1 ==> image spread 2 ==> profile spread 3 ==> follow spread
 */
export const showImages = (imageData, clickFunc, flag) => {
    return imageData.map((image, index) => {

        let className = 'position-absolute rounded';

        // const correctFlag = (flag === 1 && image.medium !== 'whoami') || (flag === 2 && image.type === 'profile');

        if ([1, 2, 3].includes(flag)) {
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
                            <div className="card">
                                <span id={image.type} className="mx-auto" style={{ fontSize: DEFAULT_PROFILE_FONT_SIZE * image.specifics.curr_width / DEFAULT_PROFILE_SIZE_VALUE, userSelect: 'none' }}>
                                    {image.type}
                                </span>
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