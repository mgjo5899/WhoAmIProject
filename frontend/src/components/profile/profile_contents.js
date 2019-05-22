import React, { Fragment, useState, useEffect } from 'react';
import { SERVER } from '../../config';
import Axios from 'axios';
import Gallery from 'react-grid-gallery';

const ProfileContents = ({ activeIndex, contentsIndex, element, previous, profile, setProfile }) => {

    const [markedImage, setMarkedImage] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [images, setImages] = useState([]);
    const [contents, setContents] = useState([]);

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
            images.map(image => ({
                src: image.raw_content_url,
                thumbnail: image.raw_content_url,
                thumbnailWidth: image.orig_width,
                thumbnailHeight: image.orig_height,
                isSelected: false
            }))
        );
        // give signal to contents
        setMarkedImage(false);
        // turn off spinner
        setSpinner(false);
    }, [images]);

    useEffect(() => {
        // get the images that already registered, and mark as checked if it is a same source
        if (!markedImage) markExistingImages();
    }, [markedImage]);

    //fetch image function
    const fetchImage = async () => {
        // fetch data in the link
        try {
            const userData = (await Axios.get(SERVER + element.link)).data;
            if (!userData.status) throw new Error(userData.message);
            // fetching contents
            const contentsData = userData.contents;
            setImages(
                contentsData.map(content => ({
                    orig_width: content.orig_width,
                    orig_height: content.orig_height,
                    raw_content_url: content.raw_content_url,
                }))
            );
        } catch (error) {
            console.log(error);
        }
    }

    const markExistingImages = () => {
        const content = contents.find(content => content.src === profile.profile_image_url);
        // check the url using previous set if it should be marked or not
        if (content) {
            content.isSelected = true;
        }
        // selected marking from contents
        setMarkedImage(true);
    }

    const onSelectImage = index => {
        const img = contents[index];
        setContents(contents => (
            contents.map(content => {
                if (content === img) {
                    return {
                        ...content,
                        isSelected: !content.isSelected
                    }
                } else {
                    return {
                        ...content,
                        isSelected: false
                    }
                }
            })
        ))
    }

    const handleDone = () => {
        const selected = contents.find(content => content.isSelected);
        const url = selected ? selected.src : '';
        setProfile({ ...profile, profile_image_url: url });
        previous();
        previous();
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
                <button className="btn btn-primary mx-auto" onClick={handleDone}>Done</button>
            </div>
        </Fragment>
    );
}

export default ProfileContents;