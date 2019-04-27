import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';
import { getExistingImages, isOwner } from '../../store/actions/data_actions';
import { PlusButton, WhiteBoard } from './whiteboard';

const Dashboard = ({ next, activeIndex, contentsIndex, data, defaultWidth, defaultHeight, username, auth, showImages, getExistingImages }) => {

    const [images, setImages] = useState([]);
    const [height, setHeight] = useState(0);
    const [modal, setModal] = useState(false);
    const [currentImage, setCurrentImage] = useState({});

    useEffect(() => {
        if (activeIndex === contentsIndex.dashboard) {
            // when first loaded to dashboard, get existing data from server
            setHeight(defaultHeight);
            getExistingImages(auth, username);
        }
    }, [activeIndex]);

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
            <PlusButton isOwner={isOwner(auth, username)} next={next} />
            <Modal isOpen={modal} centered={true} toggle={toggle} className="d-flex">
                <div className="d-flex" onClick={() => window.open(currentImage.source)}>
                    <img src={currentImage.image} alt="" className="w-100 h-100" />
                </div>
            </Modal>
            <WhiteBoard {...{ defaultWidth, height, images }} />
        </Fragment>
    );
}

const mapStateToProps = state => ({
    auth: state.auth,
})

const mapDispatchToProps = dispatch => ({
    getExistingImages: (auth, username, history) => dispatch(getExistingImages(auth, username, history)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
