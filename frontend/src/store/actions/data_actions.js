import React from 'react';
import { SOCIAL_MEDIA_CONFIG } from '../../config';

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
            className="card position-absolute rounded"
            key={index}
            style={{
                width: image.curr_width || 200,
                height: image.curr_height || 'auto',
                WebkitTransform: `translate(${image.posX || image.pos_x}px, ${image.posY || image.pos_y}px)`,
                transform: `translate(${image.posX || image.pos_x}px, ${image.posY || image.pos_y}px)`,
                background: SOCIAL_MEDIA_CONFIG.find(socialMedia => socialMedia.medium === image.medium).backgroundBorderColor,
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
            <img
                className="w-100 h-100"
                src={image.src || image.raw_content_url}
                alt=""
            />
        </div>
    ))
)