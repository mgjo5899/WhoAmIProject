import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';
import { getExistingImages, isOwner } from '../../store/actions/data_actions';
import { PlusButton, WhiteBoard } from './whiteboard';
import { withRouter } from 'react-router';

const Dashboard = ({ next, activeIndex, contentsIndex, data, defaultWidth, defaultHeight, username, auth, showImages, getExistingImages, history }) => {

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

    useEffect(() => {
        console.log(data);
        // setting images forming to right elements
        setImages(showImages(data.existing, toggle, 0));
        settingHeight();
    }, [data.existing]);

    const toggle = image => {
        if (modal) {
            setCurrentImage({});
        } else {
            setCurrentImage({ ...currentImage, image: image.specifics.raw_content_url, source: image.specifics.content_url });
        }
        setModal(!modal);
    }

    const settingHeight = () => {
        let maxHeight = defaultHeight;
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
