import React, { Fragment, useEffect, useState } from 'react';
import Axios from 'axios';
import { SERVER, SECRET_KEY } from '../../config';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

const Dashboard = ({ next, activeIndex, contentsIndex, data, setData, defaultWidth, defaultHeight, resetData, username, auth }) => {

    const [images, setImages] = useState([]);
    const [height, setHeight] = useState(0);
    const [modal, setModal] = useState(false);

    useEffect(() => {
        if (activeIndex === contentsIndex.dashboard) {
            // when first loaded to dashboard, get existing data from server
            setHeight(defaultHeight);
            getExistingImages();
        }
    }, [activeIndex]);

    useEffect(() => {
        console.log(data);
    }, [data]);

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
                        data-y={image.pos_y}
                        onClick={toggle}
                    >
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

    const toggle = () => {
        setModal(!modal);
    }

    const settingHeight = () => {
        let maxHeight = defaultHeight;
        data.existing.forEach(elem => {
            maxHeight = Math.max(maxHeight, elem.pos_y + elem.curr_height + 100);
        });
        setHeight(maxHeight);
    }

    const getExistingImages = async () => {
        if (isOwner()) {
            await getOwnerExistingImages();
        } else {
            await getUserExistingImages();
        }
    }

    const getOwnerExistingImages = async () => {
        try {
            const { status, whiteboard_data, message } = (await Axios.get(SERVER + '/whiteboard/user_data')).data;
            if (!status) throw new Error(message);
            setData({
                ...resetData(),
                existing: whiteboard_data
            });
        } catch (error) {
            console.log(error);
        }
    }

    const getUserExistingImages = async () => {
        try {
            const { status, whiteboard_data, message } = (await Axios.post(SERVER + '/whiteboard/published_data', {
                username,
                secret_key: SECRET_KEY
            })).data;
            if (!status) throw new Error(message);
            setData({
                ...resetData(),
                existing: whiteboard_data
            });
        } catch (error) {
            console.log(error);
        }
    }

    const isOwner = () => (auth.user.username === username)

    return (
        <Fragment>
            {
                isOwner() && (
                    <div className="d-block">
                        <div className="d-flex justify-content-end">
                            <svg id="i-plus" onClick={next} className="m-2 text-dark bg-primary rounded-circle" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                                <path d="M16 2 L16 30 M2 16 L30 16" />
                            </svg>
                        </div>
                    </div>
                )
            }
            <div id="spread-sheet" className="card p-2 mt-3" style={{ defaultWidth, height }}>
                {images}
            </div>
        </Fragment>
    );
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps)(Dashboard);
