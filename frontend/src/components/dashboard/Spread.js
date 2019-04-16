import React, { Fragment, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Drag } from './DragAndDrop';
import Axios from 'axios';
import { SERVER, SOCIAL_MEDIA_CONFIG } from '../../config';

const Spread = ({ next, previous, data, defaultWidth, defaultHeight, activeIndex, contentsIndex, deleteImage, element }) => {

    const [changed, setChanged] = useState([]);
    const [images, setImages] = useState([]);
    const [height, setHeight] = useState(0);

    const handleClose = image => {
        deleteImage(image);
    }

    useEffect(() => {
        Drag(setChanged);
    }, []);

    useEffect(() => {
        if (activeIndex === contentsIndex.spread) {
            setHeight(defaultHeight);
            // create set for putting deleted data id
            const deleteIdSet = new Set();
            data.delete.forEach(img => {
                deleteIdSet.add(img.id);
            })
            // combine selected image data and existing data where it is not part of selected medium, and filter it again where it is not in the deleted image
            const imagesToShow = [...data.selected, ...data.existing.filter(img => img.medium !== element.medium).filter(img => !deleteIdSet.has(img.id))];
            setImages(
                // get selected images from previous element
                imagesToShow.map((image, key) => (
                    <div
                        id={image.id}
                        medium={image.medium}
                        orig_width={image.orig_width}
                        orig_height={image.orig_height}
                        className="card draggable position-absolute resize-drag rounded"
                        key={key}
                        style={{
                            width: image.curr_width || 200,
                            height: 'auto',
                            WebkitTransform: `translate(${image.posX || image.pos_x}px, ${image.posY || image.pos_y}px)`,
                            transform: `translate(${image.posX || image.pos_x}px, ${image.posY || image.pos_y}px)`,
                            background: SOCIAL_MEDIA_CONFIG.find(socialMedia => socialMedia.medium === image.medium).backgroundBorderColor,
                            padding: 3
                        }}
                        data-x={image.posX || image.pos_x}
                        data-y={image.posY || image.pos_y}>
                        <button type="button" onClick={() => handleClose(image)} className="close position-absolute" style={{ top: '2%', right: '2%' }} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <img
                            className="w-100 h-100"
                            src={image.src || image.raw_content_url}
                            alt=""
                        />
                    </div>
                ))
            );
            // set height of whiteboard based on the selected images
            setHeight(getHeight());
        }
    }, [activeIndex, data.selected]);

    const getHeight = () => {
        let maxHeight = height;
        // iterate through every array, get maximum and return 200 added
        images.forEach(image => {
            maxHeight = Math.max(maxHeight, image.props['data-y'] + 300);
        });
        return maxHeight;
    }

    const handleLoadMore = () => {
        setHeight(height + 300);
    }

    const addData = async () => {
        try {
            await Axios.post(SERVER + '/whiteboard/user_data', {
                new_contents: data.new.map(elem => {
                    return {
                        type: elem.type,
                        medium: elem.medium,
                        pos_x: changed[elem.id] ? changed[elem.id].posX : elem.posX,
                        pos_y: changed[elem.id] ? changed[elem.id].posY : elem.posY,
                        [elem.specific]: {
                            raw_content_url: elem.src,
                            [elem.elementSourceUrl]: elem.sourceUrl,
                            orig_width: elem.orig_width,
                            orig_height: elem.orig_height,
                            curr_width: changed[elem.id] ? changed[elem.id].width : 200,
                            curr_height: changed[elem.id] ? changed[elem.id].height : (elem.orig_height / elem.orig_width * 200)
                        }
                    };
                })
            });
        } catch (error) {
            console.log(error);
        }
    }

    const changeData = async () => {
        // put all existing data except delete data
        const existingIdSet = new Set();
        data.existing.forEach(elem => {
            existingIdSet.add(elem.id);
        });
        try {
            await Axios.put(SERVER + '/whiteboard/user_data', {
                updated_contents: images.filter(image => existingIdSet.has(image.props.id) && changed[image.props.id]).map(image => ({
                    id: image.props.id,
                    medium: image.props.medium,
                    pos_x: changed[image.props.id].posX,
                    pos_y: changed[image.props.id].posY,
                    curr_width: changed[image.props.id].width,
                    curr_height: changed[image.props.id].height
                })
                )
            });
        } catch (error) {
            console.log(error);
        }
    }

    const deleteData = async () => {
        try {
            await Axios.delete(SERVER + '/whiteboard/user_data', {
                data: {
                    deleted_contents: data.delete.map(elem => elem.id)
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    const handleNext = async () => {
        try {
            await addData();
            await changeData();
            await deleteData();
            next();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Fragment>
            <InfiniteScroll
                pageStart={0}
                loadMore={handleLoadMore}
                hasMore={true}
                loader={<div className="loader" key={0}>Loading ...</div>}
                threshold={0}
            >
                <div id="spread-sheet" className="card p-2 mt-3" style={{ defaultWidth, height }}>
                    {images}
                </div>
            </InfiniteScroll>
            <hr />
            <div className="fixed-bottom card-footer bg-secondary d-flex justify-content-center" style={{ opacity: 0.9 }}>
                <button className="btn btn-danger mx-auto" onClick={previous}>Cancel</button>
                <button className="btn btn-primary mx-auto" onClick={handleNext}>Publish</button>
            </div>
        </Fragment >
    );
}

export default Spread;