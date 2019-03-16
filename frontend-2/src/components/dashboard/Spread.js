import React, { Fragment, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Drag } from './DragAndDrop';
import Axios from 'axios';
import { SERVER } from '../../config';

const Spread = ({ next, previous, element, setContents, data }) => {

    const [images, setImages] = useState([]);
    const [height, setHeight] = useState(1000);
    const width = 1000;

    useEffect(() => {
        Drag();
    }, []);

    const handleClose = image => {
        setContents(contents => {
            const contentIndex = contents.findIndex(content => content.src === image.src);
            contents[contentIndex].isSelected = !contents[contentIndex].isSelected;
            return contents;
        });
    }

    useEffect(() => {
        const style = {
            width: 200,
            height: 'auto'
        }
        setImages(
            data.selected.map((image, key) => (
                <div
                    id={image.src}
                    className="card draggable position-absolute resize-drag rounded"
                    key={key}
                    style={{
                        ...style,
                        WebkitTransform: `translate(${image.randomWidth}px, ${image.randomHeight}px)`,
                        transform: `translate(${image.randomWidth}px, ${image.randomHeight}px)`
                    }}
                    data-x={image.randomWidth}
                    data-y={image.randomHeight}>
                    <button type="button" onClick={() => handleClose(image)} className="close position-absolute" style={{ top: '2%', right: '2%' }} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <img
                        className="w-100 h-100"
                        src={image.src}
                        alt=""
                    />
                </div>
            ))
        );
        // setSize({ width: elem.offsetWidth, height: elem.offsetHeight });
    }, [data.selected]);

    const handleLoadMore = () => {
        setHeight(height + 300);
    }

    const handleNext = async () => {
        console.log(data);

        const resData = await Axios.post(SERVER + '/whiteboard/user_data', {
            new_contents: data.new.map(elem => {
                const curImg = images.find(image => image.props.id === elem.src);
                const [pos_x, pos_y] = [curImg.props['data-x'], curImg.props['data-y']];
                const [curr_width, curr_height] = [curImg.props.style.width, curImg.offsetHeight];
                const res = {
                    type: elem.type,
                    medium: element.medium,
                    pos_x,
                    pos_y,
                    [element.specific]: {
                        raw_content_url: elem.src,
                        [element.sourceUrl]: elem.sourceUrl,
                        orig_width: elem.orig_width,
                        orig_height: elem.orig_height,
                        curr_width,
                        curr_height
                    }
                };
                console.log(res);
                return res
            })
        });
        console.log(resData.data);
        // next();
        // setImageSelected([]);
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
                <div id="spread-sheet" className="card p-2 mt-3" style={{ width, height }}>
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