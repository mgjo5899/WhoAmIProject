import React, { Fragment, useEffect, useState } from 'react';
import Axios from 'axios';
import { SERVER } from '../../config';

const Dashboard = ({ next, activeIndex, contentsIndex, data, setData, defaultWidth, defaultHeight, resetData }) => {

    const [images, setImages] = useState([]);
    const [height, setHeight] = useState(defaultHeight);

    useEffect(() => {
        if (activeIndex === contentsIndex.dashboard) {
            // when first loaded to dashboard, get existing data from server
            getExistingImages();
        }
    }, [activeIndex]);

    useEffect(() => {
        console.log(data);
    }, [data])

    useEffect(() => {
        if (data.existing.length > 0) {
            // setting images forming to right elements
            console.log(data);
            setImages(
                data.existing.map((image, index) => (
                    <div
                        id={image.id}
                        medium={image.medium}
                        orig_width={image.orig_width}
                        orig_height={image.orig_height}
                        className="card position-absolute rounded"
                        key={index}
                        style={{
                            width: image.curr_width,
                            height: image.curr_height,
                            WebkitTransform: `translate(${image.pos_x}px, ${image.pos_y}px)`,
                            transform: `translate(${image.pos_x}px, ${image.pos_y}px)`
                        }}
                        data-x={image.pos_x}
                        data-y={image.pos_y}>
                        <img
                            className="w-100 h-100"
                            src={image.raw_content_url}
                            alt=""
                        />
                    </div>
                ))
            );
        }
        settingHeight();
    }, [data.existing]);

    const settingHeight = () => {
        let maxHeight = height;
        data.existing.forEach(elem => {
            maxHeight = Math.max(maxHeight, elem.pos_y + elem.curr_height + 100);
        });
        setHeight(maxHeight);
    }

    const getExistingImages = async () => {
        try {
            setData(resetData());
            const { status, whiteboard_data } = (await Axios.get(SERVER + '/whiteboard/user_data')).data;
            if (!status) throw new Error('Error occured while fetching whiteboard user data');
            setData(data => ({
                ...data,
                existing: whiteboard_data
            }));
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Fragment>
            <div className="d-block">
                <div className="d-flex justify-content-end">
                    <svg id="i-plus" onClick={next} className="m-2 text-dark bg-primary rounded-circle" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                        <path d="M16 2 L16 30 M2 16 L30 16" />
                    </svg>
                </div>
            </div>
            <div id="spread-sheet" className="card p-2 mt-3" style={{ defaultWidth, height }}>
                {images}
            </div>
        </Fragment>
    );
}

export default Dashboard;
