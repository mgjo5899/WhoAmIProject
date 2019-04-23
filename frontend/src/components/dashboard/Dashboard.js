import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { getExistingImages, isOwner } from '../../store/actions/data_actions';

const Dashboard = ({ next, activeIndex, contentsIndex, data, defaultWidth, defaultHeight, username, auth, history, showImages, getExistingImages }) => {

    const [images, setImages] = useState([]);
    const [height, setHeight] = useState(0);
    const [modal, setModal] = useState(false);
    const [currentImage, setCurrentImage] = useState({});

    useEffect(() => {
        if (activeIndex === contentsIndex.dashboard) {
            // when first loaded to dashboard, get existing data from server
            setHeight(defaultHeight);
            getExistingImages(auth, username, history);
        }
    }, [activeIndex]);

    // useEffect(() => {
    //     console.log(data);
    // }, [data]);

    useEffect(() => {
        if (data.existing) {
            // setting images forming to right elements
            setImages(showImages(data.existing, toggle, false));
        }
        settingHeight();
    }, [data.existing]);

    const toggle = image => {
        if (modal) {
            setCurrentImage({});
        } else {
            setCurrentImage({ ...currentImage, image: image.raw_content_url });
            // temporory easy way of handling
            setCurrentImage(currentImage => ({ ...currentImage, source: image[image.medium + '_url'] }));
        }
        setModal(!modal);
    }

    const settingHeight = () => {
        let maxHeight = defaultHeight;
        data.existing.forEach(elem => {
            maxHeight = Math.max(maxHeight, elem.pos_y + elem.curr_height + 100);
        });
        setHeight(maxHeight);
    }

    return (
        <Fragment>
            {
                isOwner(auth, username) && (
                    <div className="d-block">
                        <div className="d-flex justify-content-end">
                            <svg id="i-plus" onClick={next} className="m-2 text-dark bg-primary rounded-circle" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                                <path d="M16 2 L16 30 M2 16 L30 16" />
                            </svg>
                        </div>
                    </div>
                )
            }
            <Modal isOpen={modal} centered={true} toggle={toggle} className="d-flex">
                <div className="d-flex" onClick={() => window.open(currentImage.source)}>
                    <img src={currentImage.image} alt="" className="w-100 h-100" />
                </div>
            </Modal>
            <div id="spread-sheet" className="card p-2 mt-3" style={{ defaultWidth, height }}>
                {images}
            </div>
        </Fragment>
    );
}

const mapStateToProps = state => ({
    auth: state.auth,
})

const mapDispatchToProps = dispatch => ({
    getExistingImages: (auth, username, history) => dispatch(getExistingImages(auth, username, history)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
