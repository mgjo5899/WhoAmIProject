import React, { Fragment, useEffect, useState } from 'react';
import Axios from 'axios';
import { SERVER, DEFAULT_WIDTH, DEFAULT_HEIGHT } from '../../config';
import InfiniteScroll from 'react-infinite-scroller';
import { WhiteBoard } from './whiteboard';
import { connect } from 'react-redux';
import { updateData, deleteData } from '../../store/actions/data_actions';

const Spread = ({ next, previous, data, activeIndex, contentsIndex, changed, images }) => {
    const [height, setHeight] = useState(0);
    useEffect(() => {
        if (activeIndex === contentsIndex.spread) {
            setHeight(DEFAULT_HEIGHT);
        }
    }, [activeIndex]);

    const handleLoadMore = () => {
        setHeight(height + 100);
    }

    const addData = async () => {
        console.log(data.new)
        console.log(changed)
        try {
            const result = (await Axios.post(SERVER + '/whiteboard/user_data', {
                new_contents: data.new.map(elem => ({
                    type: elem.type,
                    medium: elem.medium,
                    pos_x: changed[elem.id] ? changed[elem.id].pos_x : elem.pos_x,
                    pos_y: changed[elem.id] ? changed[elem.id].pos_y : elem.pos_y,
                    specifics: {
                        raw_content_url: elem.specifics.raw_content_url,
                        content_url: elem.specifics.content_url,
                        orig_width: elem.specifics.orig_width,
                        orig_height: elem.specifics.orig_height,
                        curr_width: changed[elem.id] ? changed[elem.id].width : 200,
                        curr_height: changed[elem.id] ? changed[elem.id].height : (elem.specifics.orig_height / elem.specifics.orig_width * 200)
                    }
                }))
            })).data;
            console.log(result);
            if (!result.status) throw new Error(result.message);
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
        await updateData(changed, images.filter(image => existingIdSet.has(image.props.id) && changed[image.props.id]));
    }

    const handleNext = async () => {
        try {
            await addData();
            await changeData();
            await deleteData(data.delete);
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
                <WhiteBoard {...{ DEFAULT_WIDTH, height, images }} />
            </InfiniteScroll>
            <hr />
            <div className="fixed-bottom card-footer bg-secondary d-flex justify-content-center" style={{ opacity: 0.9 }}>
                <button className="btn btn-danger mx-auto" onClick={previous}>Cancel</button>
                <button className="btn btn-primary mx-auto" onClick={handleNext}>Publish</button>
            </div>
        </Fragment >
    );
}

const mapStateToProps = state => ({
    changed: state.changed
});

export default connect(mapStateToProps)(Spread);