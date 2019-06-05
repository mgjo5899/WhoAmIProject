import React, { Fragment, useState, useEffect } from 'react';
import { SERVER, DEFAULT_WIDTH, DEFAULT_HEIGHT, DEFAULT_SUBTRACTING_VALUE } from '../../config';
import Axios from 'axios';
import Gallery from 'react-grid-gallery';
import uuidv4 from 'uuid/v4';

const Contents = ({ next, previous, element, contents, setContents, data, setData, activeIndex, contentsIndex, deleteImage }) => {

    const [markedImage, setMarkedImage] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [videoUrlList, setVideoUrlList] = useState([]);
    const [gallery, setGallery] = useState(null);

    // load images
    useEffect(() => {
        if (activeIndex === contentsIndex.contents) {
            // store images from api to data image
            // set spinner while loading
            setSpinner(true);
            fetchImage();
        }
    }, [activeIndex]);

    // call when image loading changes
    useEffect(() => {
        // make the form for making gallery
        // setting contents which would display on the screen
        setContents(
            data.images.map(image => ({
                id: image.id,
                src: image.specifics.raw_content_url,
                thumbnail: image.specifics.raw_content_url,
                thumbnailWidth: image.specifics.orig_width,
                thumbnailHeight: image.specifics.orig_height,
                posX: image.pos_x !== undefined ? image.pos_x : Math.floor(Math.random() * (DEFAULT_WIDTH - DEFAULT_SUBTRACTING_VALUE)),
                posY: image.pos_y !== undefined ? image.pos_y : Math.floor(Math.random() * (DEFAULT_HEIGHT - DEFAULT_SUBTRACTING_VALUE)),
                isSelected: false,
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
        // give signal to contents
        setMarkedImage(false);
        // turn off spinner
        setSpinner(false);
    }, [data.images]);

    useEffect(() => {
        // get the images that already registered, and mark as checked if it is a same source
        if (!markedImage && contents.length > 0) markExistingImages();
    }, [contents, markedImage]);

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
                    image.isSelected = true;
                }
                return image;
            })
        );
        // selected marking from contents
        setData({
            ...data,
            selected: contents.filter(content => content.isSelected)
        });
        setMarkedImage(true);
        setGallery(<Gallery
            images={contents}
            onSelectImage={onSelectImage}
            backdropClosesModal={true}
        />);
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
            contentsData.forEach(content => {
                if (content.type === 'video') {
                    setVideoUrlList(videoUrlList => [...videoUrlList, content.raw_content_url]);
                }
            });
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
                )
            });
        } catch (error) {
            console.log(error);
        }
    }

    const onSelectImage = index => {
        const img = contents[index];
        deleteImage(img);
    }

    useEffect(() => {
        // convert img data to video if necessary
        const videoUrlSet = new Set(videoUrlList);
        console.log(videoUrlSet)
        if (videoUrlList.length !== 0) {
            console.log(this)
            console.log(document.getElementsByTagName('img').length)
            // while (document.getElementsByTagName('img').length <= 3);
            console.log(document.getElementsByTagName('img'));
            for (const imgTag of document.getElementsByTagName('img')) {
                if (videoUrlSet.has(imgTag.currentSrc)) {
                    console.log('hi')
                }
            }
            // document.getElementsByTagName('img').forEach(imgTag => {
            // console.log(imgTag)
            // if (videoUrlSet.has(imgTag.currentSrc)) {

            // }
            // });
        }
    }, [gallery]);

    return (
        <Fragment>
            <div className="d-flex justify-content-center m-2">
                {element && <img src={element.src} alt={element.name} className="w-25 h-25" />}
            </div>
            <hr />
            <h5 className="d-flex justify-content-center m-2">Select the image</h5>
            <hr />
            {
                spinner ? (
                    <div className="spinner-border d-block mx-auto my-auto" role="status" />
                )
                    : (
                        <div style={{
                            display: "block",
                            minHeight: "1px",
                            width: "100%",
                            border: "1px solid #ddd",
                            overflow: "auto",
                            marginBottom: 100
                        }}>
                            {/* {markedImage && (
                                <Gallery
                                    images={contents}
                                    onSelectImage={onSelectImage}
                                    backdropClosesModal={true}
                                /> */}
                            {gallery}
                            )}
                        </div>
                    )
            }
            <div className="fixed-bottom card-footer bg-secondary d-flex justify-content-center" style={{ opacity: 0.9 }}>
                <button className="btn btn-danger mx-auto" onClick={previous}>Cancel</button>
                <button className="btn btn-primary mx-auto" onClick={next}>Done</button>
            </div>
        </Fragment>
    );
}

export default Contents;