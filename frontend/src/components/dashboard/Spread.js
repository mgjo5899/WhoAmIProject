import React, { Fragment, useEffect, useState } from 'react';
import { Drag } from './drag_and_drop';
import Axios from 'axios';
import { SERVER } from '../../config';
import InfiniteScroll from 'react-infinite-scroller';
import { WhiteBoard } from './whiteboard';

const Spread = ({ next, previous, data, setData, defaultWidth, defaultHeight, activeIndex, contentsIndex, deleteImage, element, showImages, flag }) => {

    const [changed, setChanged] = useState([]);
    const [images, setImages] = useState([]);
    const [height, setHeight] = useState(0);

    const handleClose = image => {
        // if it is closing profile element, then just filter it out
        if (image.medium === 'whoami' && image.type === 'profile') {
            // if the profile element is already in there, put it into delete data
            // find index of the data to judge
            const existingIndex = data.existing.findIndex(img => img.id === image.id);
            // if there is an index, then remove selected
            if (existingIndex !== -1) {
                setData({ existing: data.existing.filter(img => img.id !== data.existing[existingIndex].id) });
            } else {
                // filter out of selected
                deleteImage(image);
            }
        } else {
            // just make it regular
            deleteImage(image);
        }
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
            });
            const imagesToShow = [...data.selected, ...data.existing.filter(img => img.medium !== element.medium).filter(img => !deleteIdSet.has(img.id))];
            console.log(imagesToShow)
            setImages(showImages(imagesToShow, handleClose, flag));
            // set height of whiteboard based on the selected images
            setHeight(getHeight());
        }
    }, [activeIndex, data.selected]);

    const getHeight = () => {
        let maxHeight = height;
        // iterate through every array, get maximum and return 200 added
        images.forEach(image => {
            maxHeight = Math.max(maxHeight, image.props['data-y'] + 300);
            console.log(maxHeight)
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
                // loader={<div className="loader" key={0}>Loading ...</div>}
                threshold={0}
            >
                <WhiteBoard {...{ defaultWidth, height, images }} />
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