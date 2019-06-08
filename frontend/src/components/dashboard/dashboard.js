import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';
import { WhiteBoard } from './whiteboard';
import { withRouter } from 'react-router';
import { DEFAULT_WIDTH, DEFAULT_HEIGHT, SERVER, SECRET_KEY } from '../../config';
import InputForm from '../profile/input_form';
import InfiniteScroll from 'react-infinite-scroller';
import { resetChanged, setChanged } from '../../store/actions/changed_actions';
import Axios from 'axios';
import { showImages, updateData, deleteData } from '../../store/actions/data_actions';
import FollowingFollowersDisplay from '../follow/following_followers_display';


const Dashboard = ({ next, activeIndex, contentsIndex, data, username, setData, auth, history, changed, resetChanged, resetData, images, setImages, setPrevElementMedium }) => {

    // const [images, setImages] = useState([]);
    const [height, setHeight] = useState(0);
    const [modal, setModal] = useState(false);
    const [currentImage, setCurrentImage] = useState({});
    const [modalContent, setModalContent] = useState(null);
    const [flag, setFlag] = useState(0);
    const [deleted, setDeleted] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        if (activeIndex === contentsIndex.dashboard) {
            // when first loaded to dashboard, get existing data from server
            setHeight(DEFAULT_HEIGHT);
            setPrevElementMedium(null);
            resetChanged();
            setDeleted([]);
            (async () => {
                await getExistingImages(auth, username, history);
                await getFollowingData();
            })();
            // getExistingImages(auth, username, history);
            // getFollowingData();
        }
    }, [activeIndex, flag]);

    const getFollowingData = async () => {
        try {
            // if there's user credential in the page
            if (auth.user.username) {
                // get all following data, and find if the username is included in this data
                const { status, following_users, message } = (await Axios.get(SERVER + '/user/following_users')).data;
                if (!status) throw new Error(message);
                // if we find the index of following user, set isFollowing true, else false 
                following_users.findIndex(user => user.username === username) !== -1 ? setIsFollowing(true) : setIsFollowing(false);
            } else {
                setIsFollowing(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

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
            } else if (image.type === 'follow') {
                toggleFollow(image);
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

    const toggleProfile = image => {
        setModalContent(
            <div className="card">
                <div className="card-body">
                    <InputForm auth={auth} readOnly={true} profile={image.specifics} />
                </div>
            </div>
        )
    }

    const toggleFollow = image => {
        const contentsIndex = {
            following_followers: 0
        };
        const activeIndex = 0;
        setModalContent(
            <div className="card">
                <div className="card-body">
                    <FollowingFollowersDisplay {...{ activeIndex, contentsIndex, auth, username, dashboard: true }} />
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
        const { status, whiteboard_data, message } = (await Axios.get(SERVER + '/whiteboard/user_data')).data;
        if (!status) throw new Error(message);
        setData(resetData());
        setData(data => ({
            ...data,
            existing: whiteboard_data
        }));
    }

    const getUserExistingImages = async username => {
        const { status, whiteboard_data, message } = (await Axios.post(SERVER + '/whiteboard/published_data', {
            username,
            secret_key: SECRET_KEY
        })).data;
        if (!status) throw new Error(message);
        setData(resetData());
        setData(data => ({
            ...data,
            existing: whiteboard_data
        }));
    }

    const handleFollow = async () => {
        // if it is not authorized, then move to the home page
        if (!auth.user.email) {
            history.push('/');
        } else {
            // if it is authorized separate the case, follow or unfollow

            // if currently following, delete following
            try {
                if (isFollowing) {
                    const { status, message } = (await Axios.delete(SERVER + '/user/following_users', {
                        data: {
                            followed_user_username: username
                        }
                    })).data;
                    // if status is false, throw error to print to console output
                    if (!status) throw new Error(message);
                    setIsFollowing(false);
                } else {
                    // if it is currently not following, follow the user
                    const { status, message } = (await Axios.post(SERVER + '/user/following_users', {
                        followed_user_username: username
                    })).data;
                    // if status is false, throw error to print to console output
                    if (!status) throw new Error(message);
                    setIsFollowing(true);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <Fragment>
            <div className="d-flex justify-content-end mt-1">
                <div className={(isOwner(auth, username) ? 'invisible' : undefined)}>
                    <button className="btn btn-outline-primary btn-sm mx-2" onClick={handleFollow}>
                        {!isFollowing ? 'follow' : 'unfollow'}
                    </button>
                </div>
                <div className={((!isOwner(auth, username) || flag === 1) ? 'd-none' : undefined)}>
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
    setChanged: changed => dispatch(setChanged(changed)),
    resetChanged: () => dispatch(resetChanged())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));