import React from 'react';
import Axios from 'axios';
import { SOCIAL_MEDIA_CONFIG, SECRET_KEY, SERVER } from '../../config';

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
 * @param {boolean} close - whether it has close button or not
 */
export const showImages = (imageData, clickFunc, close) => (
    imageData.map((image, index) => (
        <div
            id={image.id}
            medium={image.medium}
            orig_width={image.orig_width}
            orig_height={image.orig_height}
            className={"card position-absolute rounded" + (close ? ' draggable resize-drag' : '')}
            key={index}
            style={{
                width: image.curr_width || 200,
                height: 'auto',
                WebkitTransform: `translate(${image.posX || image.pos_x}px, ${image.posY || image.pos_y}px)`,
                transform: `translate(${image.posX || image.pos_x}px, ${image.posY || image.pos_y}px)`,
                background: SOCIAL_MEDIA_CONFIG.find(socialMedia => socialMedia.medium === image.medium) ?
                    SOCIAL_MEDIA_CONFIG.find(socialMedia => socialMedia.medium === image.medium).backgroundBorderColor :
                    '#000',
                padding: 3
            }}
            data-x={image.posX || image.pos_x}
            data-y={image.posY || image.pos_y}
            onClick={!close ? (() => clickFunc(image)) : undefined}
        >
            {close && (
                <button type="button" onClick={() => clickFunc(image)} className="close position-absolute" style={{ top: '2%', right: '2%' }} aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            )}
            {
                image.medium !== 'profile' ? (
                    <img
                        className="w-100 h-100"
                        src={image.src || image.raw_content_url}
                        alt=""
                    />
                ) : (
                        <div className="card w-100 h-100">
                            <h1>Profile</h1>
                        </div>
                    )
            }
        </div>
    ))
)

export const isOwner = (auth, username) => (auth.user.username === username)

export const getExistingImages = (auth, username, history) => async dispatch => {
    try {
        isOwner(auth, username) ? await getOwnerExistingImages(dispatch) : await getUserExistingImages(username, dispatch);
    } catch (error) {
        console.log(error)
        history.push(`/error_page?msg=${error}`);
    }
}

const getOwnerExistingImages = async dispatch => {
    const { status, whiteboard_data, message } = (await Axios.get(SERVER + '/whiteboard/user_data')).data;
    if (!status) throw new Error(message);
    dispatch(resetData());
    dispatch(setData({
        existing: whiteboard_data
    }));
}

const getUserExistingImages = async (username, dispatch) => {
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