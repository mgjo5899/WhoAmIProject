import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';
import { getExistingImages, isOwner } from '../../store/actions/data_actions';
import { setExistingProfileData } from '../../store/actions/profile_action';
import { PlusButton, WhiteBoard } from './whiteboard';
import { withRouter } from 'react-router';
import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from '../../config';
import InputForm from '../profile/input_form';

const Dashboard = ({ next, activeIndex, contentsIndex, data, username, auth, showImages, getExistingImages, history, profile }) => {

    const [images, setImages] = useState([]);
    const [height, setHeight] = useState(0);
    const [modal, setModal] = useState(false);
    const [currentImage, setCurrentImage] = useState({});
    const [modalContent, setModalContent] = useState(null);

    useEffect(() => {
        if (activeIndex === contentsIndex.dashboard) {
            // when first loaded to dashboard, get existing data from server
            setHeight(DEFAULT_HEIGHT);
            getExistingImages(auth, username, history);
        } else if (activeIndex === contentsIndex.contents) {
            setImages([]);
        }
    }, [activeIndex]);

    useEffect(() => {
        // setting images forming to right elements
        setImages(showImages(data.existing, toggle, 0));
        settingHeight();
    }, [data.existing]);

    const toggle = image => {
        if (modal) {
            setCurrentImage({});
            setModalContent(null);
            // setModalContent(null);
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

    useEffect(() => {
        setModalContent(
            <div className="d-flex" onClick={() => window.open(currentImage.source)}>
                <img src={currentImage.image} alt="" className="w-100 h-100" />
            </div>
        );
    }, [currentImage]);

    const toggleProfile = async image => {
        console.log(image)
        setModalContent(
            <div className="card">
                <div className="card-body">
                    <InputForm auth={auth} readOnly={true} profile={image.specifics} />
                </div>
            </div>
        )
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
            <Modal isOpen={modal} centered={true} toggle={toggle} contentClassName="border-0">
                {modalContent}
            </Modal>
            <WhiteBoard {...{ DEFAULT_WIDTH, height, images }} />
        </Fragment>
    );
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

const mapDispatchToProps = dispatch => ({
    getExistingImages: (auth, username, history) => dispatch(getExistingImages(auth, username, history)),
    setExistingProfileData: document => dispatch(setExistingProfileData(document))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
