import React, { Fragment, useState, useEffect } from 'react';
import { SERVER } from '../../config';
import Axios from 'axios';
import Gallery from 'react-grid-gallery';

const Contents = ({ next, previous, element, setImageSelected, contents, setContents }) => {

    const [data, setData] = useState({
        new: [],
        images: [],
        existing: [],
        change: [],
        delete: []
    });

    const [lastElementMedium, setLastElementMedium] = useState('');

    // load images
    useEffect(() => {
        // if it was previously loaded, make it efficient, don't load same thing again
        if (element && element.medium !== lastElementMedium) {
            setLastElementMedium(element.medium);
            fetchImage();
        }
    }, [element]);

    // call when image loading changes
    useEffect(() => {
        const [width, height] = [1000, 1000];

        // make the form for making gallery
        const imageList = data.images.map(image => ({
            src: image.src,
            thumbnail: image.src,
            thumbnailWidth: image.orig_width,
            thumbnailHeight: image.orig_height,
            randomWidth: Math.floor(Math.random() * (width - 200)),
            randomHeight: Math.floor(Math.random() * (height - 200))
        }));

        // get the images that already registered, and mark as checked if it is a same source
        checkExistingImages();

        // setting contents which would display on the screen
        setContents(imageList);
    }, [data.images]);

    const checkExistingImages = async () => {
        try {
            const { status, whiteboard_data } = await (await Axios.get(SERVER + '/whiteboard/user_data')).data;
            if (!status) throw new Error('Error occured while fetching whiteboard user data');
            // add whiteboard data url into the set
            const urlSet = new Set();
            whiteboard_data.forEach(({ raw_content_url }) => {
                urlSet.add(raw_content_url);
            });
            // check the url using previous set if it should be marked or not
            setData({
                images: (
                    data.images.map(image => {
                        if (image.src in urlSet) {
                            image.isSelected = true;
                        }
                        return image;
                    })
                ),
                existing: whiteboard_data
            });
        } catch (error) {
            console.log(error);
        }
    }

    //fetch image function
    const fetchImage = async () => {
        if (element) {
            // fetch data in the link
            try {
                const userData = await (await Axios.get(SERVER + element.link)).data;
                if (!userData.status) throw new Error('No right to fetch data');
                // instagram case
                const contentsData = userData[element.contents];
                setData({
                    images: (
                        contentsData.map(imageData => (
                            {
                                src: imageData.raw_content_url,
                                thumbnail: imageData.raw_content_url,
                                orig_width: imageData.orig_width,
                                orig_height: imageData.orig_height
                                // caption: data.caption.text
                            }
                        ))
                    )
                });
            } catch (error) {
                console.log(error);
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
