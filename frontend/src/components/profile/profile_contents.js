import React, { Fragment, useState, useEffect } from 'react';
import { SERVER } from '../../config';
import Axios from 'axios';
import { Modal } from 'reactstrap';
import PlayButton from '../../images/playbutton/play-button.png';

const ProfileContents = ({ activeIndex, contentsIndex, element, previous, profile, setProfile }) => {

    const [spinner, setSpinner] = useState(false);
    const [width, setWidth] = useState(0);
    const [modal, setModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [contents, setContents] = useState([]);

    // load images
    useEffect(() => {
        if (activeIndex === contentsIndex.contents) {
            // store images from api to data image
            // set spinner while loading
            setSpinner(true);
            fetchImage();
            setWidth(document.getElementById('main-container').offsetWidth);
            window.addEventListener('resize', () => {
                setWidth(document.getElementById('main-container').offsetWidth);
            });
        }
    }, [activeIndex]);

    //fetch image function
    const fetchImage = async () => {
        // fetch data in the link
        try {
            const userData = (await Axios.get(SERVER + element.link)).data;
            if (!userData.status) throw new Error(userData.message);
            // fetching contents
            const contentsData = userData.contents;
            setContents(contentsData.filter(content => content.type !== 'video').map(content => ({
                raw_content_url: content.raw_content_url,
                width: width,
                height: content.orig_height / content.orig_width * 200,
                selected: content.raw_content_url === profile.profile_image_url
            })));
            setSpinner(false);
        } catch (error) {
            console.log(error);
        }
    }

    const handleDone = () => {
        const selected = contents.find(content => content.selected);
        const url = selected ? selected.raw_content_url : '';
        setProfile({ ...profile, profile_image_url: url });
        previous();
        previous();
    }

    const mediaRender = contents => {
        const mediaGroup = [];
        for (let i = 0; i < contents.length; i += 3) {
            mediaGroup.push(contents.slice(i, i + 3));
        }

        return mediaGroup.map((group, key) => (
            <div key={key} className="row justify-content-center">
                {group.map((content, key) => tagMap(content, key))}
            </div>
        ));
    }

    const toggle = () => {
        setModal(!modal);
        setModalContent(null);
    }

    const handleImageClick = e => {
        toggle();
        e.persist();
        setModalContent(
            <div className="d-flex" onClick={() => window.open(e.target.src)}>
                <img src={e.currentTarget.children[0].src} alt="" className="w-100 h-100" />
            </div>
        )
    }

    const handleVideoClick = e => {
        toggle();
        e.persist();
        setModalContent(
            <div className="d-flex" >
                <video src={e.currentTarget.children[1].src} className="w-100 h-100" controls />
            </div>
        )
    }

    const onMouseEnterHandle = e => {
        e.currentTarget.children[0].style.opacity = 0.8;
        e.currentTarget.children[1].play();
    }

    const onMouseLeaveHandle = e => {
        e.currentTarget.children[0].style.opacity = 0.5;
        e.currentTarget.children[1].pause();
    }

    const tagMap = (content, key) => {
        const elementWidth = 22 / 100 * width;
        // const selected = contents.findIndex(content => content.raw_content_url === profile.profile_image_url) !== -1;
        const selected = content.selected;
        // console.log(content, selected)
        const tagElement = {
            image: (
                <div
                    className="d-flex"
                    onClick={handleImageClick}
                    style={{ width: elementWidth, height: elementWidth }}
                >
                    <img
                        className="position-absolute"
                        draggable={false}
                        src={content.raw_content_url}
                        alt=""
                        style={{ maxWidth: '100%', maxHeight: '100%', top: 0, bottom: 0, left: 0, right: 0, margin: 'auto' }}
                    />
                </div>
            ),
            video: (
                <Fragment>
                    <div
                        className="d-flex"
                        onMouseEnter={onMouseEnterHandle}
                        onMouseLeave={onMouseLeaveHandle}
                        onClick={handleVideoClick}
                        style={{ width: elementWidth, height: elementWidth }}
                    >
                        <img
                            className="position-absolute mx-auto my-auto"
                            draggable={false}
                            src={PlayButton}
                            style={{ left: 0, right: 0, top: 0, bottom: 0, cursor: 'pointer', width: 50, opacity: 0.5, zIndex: 1 }}
                            alt=""
                        />
                        <video
                            className="position-absolute"
                            src={content.raw_content_url}
                            muted={true}
                            style={{ maxWidth: '100%', maxHeight: '100%', top: 0, bottom: 0, left: 0, right: 0, margin: 'auto' }}
                        />
                    </div>
                </Fragment>
            )
        }

        return (
            <div
                className="d-inline-block mb-1 ml-1 p-0 d-flex position-relative"
                style={{ backgroundColor: 'white', cursor: 'pointer' }}
                key={key}
            >
                <div style={{ backgroundColor: 'black', opacity: (selected ? 0.5 : 1) }}>
                    {tagElement.image}
                </div>
                <span
                    className={"border-white rounded-circle position-absolute" + (selected ? ' bg-primary' : '')}
                    style={{ backgroundColor: 'rgba(255,255,255,0.5)', borderWidth: 2, borderStyle: 'solid', width: 50, height: 50, top: '4%', right: '4%', cursor: 'pointer' }}
                    onClick={handleSelectImage}
                />
            </div>
        );
    }

    const handleSelectImage = e => {
        const content = contents.find(content => content.raw_content_url === e.target.previousSibling.children[0].children[e.target.previousSibling.children[0].children.length - 1].src);
        // deleteImage(content);
        contents.forEach(content => {
            content.selected = false;
        });
        content.selected = true;
        setContents([...contents]);
    }

    return (
        <Fragment>
            <Modal isOpen={modal} toggle={toggle} contentClassName="border-0" centered={true}>
                {modalContent}
            </Modal>
            <div className="d-flex justify-content-center m-2">
                {element && <img src={element.src} alt={element.name} className="w-25 h-25" />}
            </div>
            <hr />
            <h5 className="d-flex justify-content-center m-2">Select the image</h5>
            <hr />
            {spinner && <div className="spinner-border d-block mx-auto my-auto" role="status" />}
            {mediaRender(contents)}
            <div className="fixed-bottom card-footer bg-secondary d-flex justify-content-center" style={{ opacity: 0.9 }}>
                <button className="btn btn-danger mx-auto" onClick={previous}>Cancel</button>
                <button className="btn btn-primary mx-auto" onClick={handleDone}>Done</button>
            </div>
        </Fragment>
    );
}

export default ProfileContents;