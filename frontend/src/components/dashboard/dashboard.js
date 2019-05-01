import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';
import { getExistingImages, isOwner } from '../../store/actions/data_actions';
import { PlusButton, WhiteBoard } from './whiteboard';
import { withRouter } from 'react-router';
import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from '../../config';

const Dashboard = ({ next, activeIndex, contentsIndex, data, username, auth, showImages, getExistingImages, history }) => {

    const [images, setImages] = useState([]);
    const [height, setHeight] = useState(0);
    const [modal, setModal] = useState(false);
    const [currentImage, setCurrentImage] = useState({});


    useEffect(() => {
        if (activeIndex === contentsIndex.dashboard) {
            // when first loaded to dashboard, get existing data from server
            setHeight(DEFAULT_HEIGHT);
            getExistingImages(auth, username, history);
        }
    }, [activeIndex]);

    useEffect(() => {
        console.log(data);
        // setting images forming to right elements
        setImages(showImages(data.existing, toggle, 0));
        settingHeight();
    }, [data.existing]);

    const toggle = image => {
        if (modal) {
            setCurrentImage({});
        }
        else {
            if (image.type === 'profile') {
                toggleProfile(image);
            } else {
                toggleImage(image);
            }
        }
        setModal(!modal);
    }

    const toggleImage = image => {
        setCurrentImage({ ...currentImage, image: image.specifics.raw_content_url, source: image.specifics.content_url });
    }

    const toggleProfile = image => {

    }

    const settingHeight = () => {
        let maxHeight = DEFAULT_HEIGHT;
        data.existing.forEach(elem => {
            maxHeight = Math.max(maxHeight, elem.pos_y + elem.specifics.curr_height + 100);
        });
        setHeight(maxHeight);
    }

    return (
        <Fragment>
            <PlusButton isOwner={isOwner(auth, username)} next={next} />
            <Modal isOpen={modal} centered={true} toggle={toggle} className="d-flex">
                <div className="d-flex" onClick={() => window.open(currentImage.source)}>
                    <img src={currentImage.image} alt="" className="w-100 h-100" />
                </div>
            </Modal>
            <WhiteBoard {...{ DEFAULT_WIDTH, height, images }} />
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
