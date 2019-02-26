import React, { Fragment, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Drag } from './DragAndDrop';
import Axios from 'axios';
import { SERVER } from '../../config';

const Spread = ({ next, previous, imageSelected, setImageSelected, setContents }) => {

    const [images, setImages] = useState([]);
    const [height, setHeight] = useState(1000);
    const width = 1000;

    useEffect(() => {
        Drag();
    }, []);

    const handleClose = image => {
        setImageSelected(imageSelected.filter(curImage => curImage.id !== image.id));
        setContents(contents => {
            const contentIndex = contents.findIndex(content => content.id === image.id);
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
            imageSelected.map((image, key) => {
                return (
                    <div
                        id={image.id}
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
                )
            })
        );
        // setSize({ width: elem.offsetWidth, height: elem.offsetHeight });
    }, [imageSelected]);

    const handleLoadMore = () => {
        setHeight(height + 300);
    }

    const handleNext = async () => {
        const data = await Axios.post(SERVER + '/instagram/update', {
            addition: imageSelected.map(image => ({
                id: image.id,
                raw_image_url: image.src,
                width: document.getElementById(image.id).offsetWidth,
                height: document.getElementById(image.id).offsetHeight,
                pos_x: image.randomWidth,
                pos_y: image.randomHeight
            }))
        });
        console.log(data);

        imageSelected.forEach(image => {
            const elem = document.getElementById(image.id);
            console.log(elem.offsetWidth, elem.offsetHeight);
        })

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