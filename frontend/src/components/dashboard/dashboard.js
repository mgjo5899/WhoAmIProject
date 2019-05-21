import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';
import { setExistingProfileData, resetData } from '../../store/actions/profile_actions';
import { WhiteBoard } from './whiteboard';
import { withRouter } from 'react-router';
import { DEFAULT_WIDTH, DEFAULT_HEIGHT, SERVER, SECRET_KEY } from '../../config';
import InputForm from '../profile/input_form';
import InfiniteScroll from 'react-infinite-scroller';
import { resetChanged, setChanged } from '../../store/actions/changed_actions';
import Axios from 'axios';


const Dashboard = ({ next, activeIndex, contentsIndex, data, username, setData, auth, showImages, history, changed, resetChanged, updateData, deleteData }) => {

    const [images, setImages] = useState([]);
    const [height, setHeight] = useState(0);
    const [modal, setModal] = useState(false);
    const [currentImage, setCurrentImage] = useState({});
    const [modalContent, setModalContent] = useState(null);
    const [flag, setFlag] = useState(0);
    const [deleted, setDeleted] = useState([]);

    useEffect(() => {
        if (activeIndex === contentsIndex.dashboard) {
            // when first loaded to dashboard, get existing data from server
            setHeight(DEFAULT_HEIGHT);
            resetChanged();
            setDeleted([]);
            getExistingImages(auth, username, history);
        } else if (activeIndex === contentsIndex.contents) {
            setImages([]);
        }
    }, [activeIndex, flag]);

    useEffect(() => {
        if (data.existing.length > 0) {
            const mapFunc = {
                0: toggle,
                1: editDelete
            }
            // setting images forming to right elements
            setImages(showImages(data.existing, mapFunc[flag], flag));
            settingHeight();
        }
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
        setModalContent(
            <div className="card">
                <div className="card-body">
                    <InputForm auth={auth} readOnly={true} profile={image.specifics} />
                </div>
            </div>
        )
    }

    const settingHeight = () => {
        let maxHeight = 0;
        data.existing.forEach(elem => {
            maxHeight = Math.max(maxHeight, elem.pos_y + elem.specifics.curr_height + 100);
        });
        setHeight(maxHeight);
    }

    const changeData = async () => {
        // put all existing data except delete data
        await updateData(changed, images.filter(image => changed[image.props.id]));
    }

    const editDelete = image => {
        setDeleted(deleted => [
            ...deleted,
            image
        ]);
        setImages(images => images.filter(img => img.props.id !== image.id));

    }

    const handleSave = async () => {
        await Promise.all([changeData(), deleteData(deleted)]);
        setFlag(0);
    }

    const handleLoadMore = () => {
        setHeight(height + 100);
    }

    const getExistingImages = async (auth, username) => {
        try {
            return isOwner(auth, username) ? await getOwnerExistingImages() : await getUserExistingImages(username);
        } catch (error) {
            history.push('/error_page');
            console.log(error);
        }
    }

    const isOwner = (auth, username) => (auth.user.username === username);

    const getOwnerExistingImages = async () => {
        const data = (await Axios.get(SERVER + '/whiteboard/user_data')).data;
        const { status, whiteboard_data, message } = data;
        if (!status) throw new Error(message);
        resetData();
        setData(data => ({
            ...data,
            existing: whiteboard_data
        }));
    }

    const getUserExistingImages = username => async dispatch => {
        const { status, whiteboard_data, message } = (await Axios.post(SERVER + '/whiteboard/published_data', {
            username,
            secret_key: SECRET_KEY
        })).data;
        if (!status) throw new Error(message);
        resetData();
        setData(data => ({
            ...data,
            existing: whiteboard_data
        }));
    }



    return (
        <Fragment>
            <div className="d-flex justify-content-end">
                <div className={'d-block' + ((!isOwner(auth, username) || flag === 1) ? ' invisible' : '')}>
                    <button className="btn btn-outline-primary btn-sm mx-2" onClick={() => setFlag(1)}>edit</button>
                    <button className="btn btn-outline-primary btn-sm mx-2" onClick={next}>add</button>
                </div>
            </div>
            <Modal isOpen={modal} centered={true} toggle={toggle} contentClassName="border-0">
                {modalContent}
            </Modal>
            {
                flag === 1 ? (
                    <Fragment>
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={handleLoadMore}
                            hasMore={true}
                            threshold={100}
                        >
                            <WhiteBoard {...{ DEFAULT_WIDTH, height, images }} />
                        </InfiniteScroll>
                        <div className="fixed-bottom card-footer bg-secondary d-flex justify-content-center" style={{ opacity: 0.9 }}>
                            <button className="btn btn-danger mx-auto" onClick={() => { setFlag(0); setImages([]); }}>Cancel</button>
                            <button className="btn btn-primary mx-auto" onClick={handleSave}>Publish</button>
                        </div>
                    </Fragment>
                ) : (
                        <WhiteBoard {...{ DEFAULT_WIDTH, height, images }} />
                    )
            }

        </Fragment>
    );
}

const mapStateToProps = state => ({
    auth: state.auth,
    changed: state.changed
})

const mapDispatchToProps = dispatch => ({
    setExistingProfileData: document => dispatch(setExistingProfileData(document)),
    setChanged: changed => dispatch(setChanged(changed)),
    resetChanged: () => dispatch(resetChanged())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));