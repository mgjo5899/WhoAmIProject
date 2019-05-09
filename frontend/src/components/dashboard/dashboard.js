import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';
import { getExistingImages, isOwner } from '../../store/actions/data_actions';
import { setExistingProfileData } from '../../store/actions/profile_actions';
import { WhiteBoard } from './whiteboard';
import { withRouter } from 'react-router';
import { DEFAULT_WIDTH, DEFAULT_HEIGHT, SERVER } from '../../config';
import InputForm from '../profile/input_form';
import Axios from 'axios';
import InfiniteScroll from 'react-infinite-scroller';
import { resetChanged, setChanged } from '../../store/actions/changed_actions';


const Dashboard = ({ next, activeIndex, contentsIndex, data, username, auth, showImages, getExistingImages, history, changed, resetChanged }) => {

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
        console.log(changed);
        try {
            await Axios.put(SERVER + '/whiteboard/user_data', {
                updated_contents: images.filter(image => changed[image.props.id]).map(image => ({
                    id: image.props.id,
                    medium: image.props.medium,
                    pos_x: changed[image.props.id].posX,
                    pos_y: changed[image.props.id].posY,
                    specifics: {
                        curr_width: changed[image.props.id].width,
                        curr_height: changed[image.props.id].height
                    }
                }))
            });
        } catch (error) {
            console.log(error);
        }
    }

    const deleteData = async () => {
        try {
            await Axios.delete(SERVER + '/whiteboard/user_data', {
                data: {
                    deleted_contents: deleted.map(elem => elem.id)
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    const editDelete = image => {
        setDeleted(deleted => [
            ...deleted,
            image
        ]);
        setImages(images => images.filter(img => img.props.id !== image.id));

    }

    const handleSave = async () => {
        await Promise.all([changeData(), deleteData()]);
        setFlag(0);
    }

    const handleLoadMore = () => {
        setHeight(height + 100);
    }

    return (
        <Fragment>
            {
                flag === 0 && (
                    <div className="d-flex justify-content-end">
                        {
                            isOwner(auth, username) && (
                                <Fragment>
                                    <button className="btn btn-outline-primary btn-sm mx-2" onClick={() => setFlag(1)}>edit</button>
                                    <button className="btn btn-outline-primary btn-sm mx-2" onClick={next}>add</button>
                                </Fragment>
                            )
                        }
                    </div>
                )
            }
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
    profile: state.profile,
    changed: state.changed
})

const mapDispatchToProps = dispatch => ({
    getExistingImages: (auth, username, history) => dispatch(getExistingImages(auth, username, history)),
    setExistingProfileData: document => dispatch(setExistingProfileData(document)),
    setChanged: changed => dispatch(setChanged(changed)),
    resetChanged: () => dispatch(resetChanged())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));