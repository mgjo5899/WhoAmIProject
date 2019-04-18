import React, { Fragment, useState, useEffect } from 'react';
import { SERVER } from '../../config';
import Axios from 'axios';
import Gallery from 'react-grid-gallery';
import uuidv4 from 'uuid/v4';

const Contents = ({ next, previous, element, contents, setContents, data, setData, activeIndex, contentsIndex, deleteImage, defaultWidth, defaultHeight }) => {

    const [markedImage, setMarkedImage] = useState(false);
    const [spinner, setSpinner] = useState(false);

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
        if (data.images && data.images.length > 0) {
            // make the form for making gallery
            // setting contents which would display on the screen
            setContents(
                data.images.map(image => ({
                    id: image.id,
                    src: image.src,
                    thumbnail: image.src,
                    thumbnailWidth: image.orig_width,
                    thumbnailHeight: image.orig_height,
                    posX: image.pos_x !== undefined ? image.pos_x : Math.floor(Math.random() * (defaultWidth - 200)),
                    posY: image.pos_y !== undefined ? image.pos_y : Math.floor(Math.random() * (defaultHeight - 200)),
                    isSelected: false,
                    medium: image.medium,
                    sourceUrl: image.sourceUrl,
                    type: image.type,
                    specific: element.specific,
                    orig_width: image.orig_width,
                    orig_height: image.orig_height,
                    curr_width: image.curr_width,
                    curr_height: image.curr_height,
                    elementSourceUrl: element.sourceUrl
                }))
            );
            // give signal to contents
            setMarkedImage(false);
            // turn off spinner
            setSpinner(false);
        }
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
    }

    //fetch image function
    const fetchImage = async () => {
        // fetch data in the link
        try {
            const userData = (await Axios.get(SERVER + element.link)).data;
            if (!userData.status) throw new Error(userData.message);
            // fetching contents
            const contentsData = userData[element.contents];
            setData({
                ...data,
                images: (
                    contentsData.map(content => (
                        {
                            id: content.id || uuidv4(),
                            medium: element.medium,
                            src: content.raw_content_url,
                            orig_width: content.orig_width,
                            orig_height: content.orig_height,
                            type: content.type,
                            sourceUrl: content[element.sourceUrl],
                            pos_x: content.pos_x,
                            pos_y: content.pos_y,
                            curr_width: content.curr_width,
                            curr_height: content.curr_height
                            // caption: data.caption.text
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
                            {markedImage && (
                                <Gallery
                                    images={contents}
                                    onSelectImage={onSelectImage}
                                    backdropClosesModal={true}
                                />
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
