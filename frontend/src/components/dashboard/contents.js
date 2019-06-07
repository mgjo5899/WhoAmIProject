import React, { Fragment, useState, useEffect } from 'react';
import { SERVER, DEFAULT_WIDTH, DEFAULT_HEIGHT, DEFAULT_SUBTRACTING_VALUE } from '../../config';
import Axios from 'axios';
import uuidv4 from 'uuid/v4';
import { Modal } from 'reactstrap';
import PlayButton from '../../images/playbutton/play-button.png';

const Contents = ({ next, previous, element, contents, setContents, data, setData, activeIndex, contentsIndex, deleteImage }) => {

    const [spinner, setSpinner] = useState(false);
    const [modal, setModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [width, setWidth] = useState(0);


    // load images
    useEffect(() => {
        if (activeIndex === contentsIndex.contents) {
            // store images from api to data image
            // set spinner while loading
            setContents([]);
            setSpinner(true);
            fetchImage();
            // for the responsive view, get the element of container
            setWidth(document.getElementById('main-container').offsetWidth);
            window.addEventListener('resize', () => {
                setWidth(document.getElementById('main-container').offsetWidth);
            });
        }
    }, [activeIndex]);

    // call when image loading changes
    useEffect(() => {
        // make the form for making gallery
        // setting contents which would display on the screen

        setContents(
            data.images.map(image => ({
                id: image.id,
                posX: image.pos_x !== undefined ? image.pos_x : Math.floor(Math.random() * (DEFAULT_WIDTH - DEFAULT_SUBTRACTING_VALUE)),
                posY: image.pos_y !== undefined ? image.pos_y : Math.floor(Math.random() * (DEFAULT_HEIGHT - DEFAULT_SUBTRACTING_VALUE)),
                medium: image.medium,
                type: image.type,
                specifics: {
                    orig_width: image.specifics.orig_width,
                    orig_height: image.specifics.orig_height,
                    curr_width: image.specifics.curr_width,
                    curr_height: image.specifics.curr_height,
                    content_url: image.specifics.content_url,
                    raw_content_url: image.specifics.raw_content_url
                }
            }))
        );
        // turn off spinner
        setSpinner(false);
    }, [data.images]);

    // useEffect(() => {
    //     // selected marking from contents
    //     console.log(contents)
    //     setData({
    //         ...data,
    //         selected: contents.filter(content => content.selected)
    //     });
    // }, [contents]);

    const markExistingImages = async () => {
        // add whiteboard data url into the set
        const existingIdSet = new Set();
        data.existing.forEach(({ id }) => {
            existingIdSet.add(id);
        });
        // check the url using previous set if it should be marked or not
        setContents(
            contents.map(image => {
                if (existingIdSet.has(image.id)) {
                    image.selected = true;
                }
                return image;
            })
        );
        // selected marking from contents
        setData({
            ...data,
            selected: contents.filter(content => content.selected)
        });
    }

    //fetch image function
    const fetchImage = async () => {
        // fetch data in the link
        try {
            const userData = (await Axios.get(SERVER + element.link)).data;
            if (!userData.status) throw new Error(userData.message);
            console.log(userData)
            // fetching contents
            const contentsData = userData.contents;
            setData({
                ...data,
                images: (
                    contentsData.map(content => (
                        {
                            id: content.id || uuidv4(),
                            medium: element.medium,
                            type: content.type,
                            pos_x: content.pos_x,
                            pos_y: content.pos_y,
                            specifics: {
                                orig_width: content.orig_width,
                                orig_height: content.orig_height,
                                raw_content_url: content.raw_content_url,
                                content_url: content.content_url,
                                curr_width: content.curr_width,
                                curr_height: content.curr_height
                            }
                        }
                    ))
                ),
                selected: contentsData
            });
        } catch (error) {
            console.log(error);
        }
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
        const selected = data.selected.findIndex(selected => selected.id === content.id) !== -1;
        const tagElement = {
            image: (
                <div
                    className="position-relative"
                    onClick={handleImageClick}
                >
                    <img
                        id={content.id}

                        className="w-100 h-100"
                        draggable={false}
                        src={content.specifics.raw_content_url}
                        alt=""
                    // style={{ opacity: (content.selected ? 0.5 : 1) }}
                    />
                </div>
            ),
            video: (
                <Fragment>
                    <div
                        className="position-relative"
                        onMouseEnter={onMouseEnterHandle}
                        onMouseLeave={onMouseLeaveHandle}
                        onClick={handleVideoClick}
                    >
                        <img
                            className="position-absolute mx-auto my-auto"
                            draggable={false}
                            src={PlayButton}
                            style={{ left: 0, right: 0, top: 0, bottom: 0, cursor: 'pointer', width: 50, opacity: 0.5, zIndex: 1 }}
                            alt=""
                        />
                        <video
                            id={content.id}
                            className="w-100 h-100"
                            src={content.specifics.raw_content_url}
                            muted={true}
                        />
                    </div>
                </Fragment>
            )
        }
        const elementWidth = 31 / 100 * width;

        return (
            <div
                className="d-inline-block mb-1 ml-1 p-0 d-flex position-relative"
                style={{ maxWidth: elementWidth, maxHeight: elementWidth, backgroundColor: 'white', cursor: 'pointer' }}
                key={key}
            >
                <div className="" style={{ backgroundColor: 'black', opacity: (selected ? 0.5 : 1) }}>
                    {tagElement[content.type]}
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
        const content = contents.find(content => content.id.toString() === e.target.previousSibling.children[0].children[e.target.previousSibling.children[0].children.length - 1].id);
        deleteImage(content);
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
                <button className="btn btn-danger mx-auto" onClick={previous}>cancel</button>
                <button className="btn btn-primary mx-auto" onClick={next}>publish</button>
            </div>
        </Fragment>
    );
}

export default Contents;