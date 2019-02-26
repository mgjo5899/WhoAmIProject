import React, { Fragment, useState, useEffect } from 'react';
import { SERVER } from '../../config';
import Axios from 'axios';
import Gallery from 'react-grid-gallery';

const uniqid = require('uniqid');

const Contents = ({ next, previous, element, setImageSelected, contents, setContents }) => {

    const [images, setImages] = useState([]);

    const [lastElementMedium, setLastElementMedium] = useState('');

    // load images
    useEffect(() => {
        if (element && element.medium !== lastElementMedium) {
            setLastElementMedium(element.medium);
            fetchImage();
        }
    }, [element]);

    // call when finish loading the image
    useEffect(() => {
        let newList = [];
        images.forEach(image => { newList = [...newList, ...image] });  // make newList for fetching all list data into one list
        const [width, height] = [1000, 1000];
        const imageList = newList.map(image => ({
            id: uniqid(),
            src: image.src.url,
            thumbnail: image.thumbnail.url,
            thumbnailWidth: image.thumbnail.width,
            thumbnailHeight: image.thumbnail.height,
            caption: image.caption,
            randomWidth: Math.floor(Math.random() * (width - 200)),
            randomHeight: Math.floor(Math.random() * (height - 200))
        }));    // make the form for making gallery
        setContents(imageList); //setting contents which would display on the screen
    }, [images]);

    //fetch image function
    const fetchImage = async () => {
        if (element) {
            // fetch data in the link
            const { status, user_contents } = await (await Axios.get(SERVER + element.link)).data;
            if (status) {
                // instagram case
                setImages(
                    user_contents
                        .data
                        .map(data => (
                            data.carousel_media
                                ?
                                data.carousel_media.map(image => (
                                    {
                                        src: image.images.standard_resolution,
                                        thumbnail: image.images.low_resolution,
                                        // caption: data.caption.text
                                    }
                                ))
                                :
                                [
                                    {
                                        src: data.images.standard_resolution,
                                        thumbnail: data.images.low_resolution,
                                        // caption: data.caption.text
                                    }
                                ]
                        )
                        )
                )
            } else {
                // throws error
                console.log('error');
            }
        }
    }

    const onSelectImage = index => {
        const images = contents
        const img = images[index];
        img.hasOwnProperty("isSelected") ? img.isSelected = !img.isSelected : img.isSelected = true;
        setContents(images);
        setImageSelected(contents.filter(image => image.isSelected));
    }

    return (
        <Fragment>
            <div style={{
                display: "block",
                minHeight: "1px",
                width: "100%",
                border: "1px solid #ddd",
                overflow: "auto"
            }}>
                <Gallery
                    images={contents}
                    onSelectImage={onSelectImage}
                    backdropClosesModal={true}
                />
            </div>
            <div className="fixed-bottom card-footer bg-secondary d-flex justify-content-center" style={{ opacity: 0.9 }}>
                <button className="btn btn-danger mx-auto" onClick={previous}>Cancel</button>
                <button className="btn btn-primary mx-auto" onClick={next}>Done</button>
            </div>
        </Fragment>
    );
}

export default Contents;
