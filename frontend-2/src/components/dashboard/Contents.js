import React, { Fragment, useState, useEffect } from 'react';
import { SERVER } from '../../config';
import Axios from 'axios';
import Gallery from 'react-grid-gallery';
import uuidv4 from 'uuid/v4';

const Contents = ({ next, previous, element, contents, setContents, data, setData }) => {

    const [lastElementMedium, setLastElementMedium] = useState('');
    const [markedImage, setMarkedImage] = useState(false);

    useEffect(() => {
        console.log(data);
    }, [data])

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
        // setting contents which would display on the screen
        data.images && data.images.length > 0 && setContents(
            data.images.map(image => ({
                id: image.id,
                src: image.src,
                thumbnail: image.src,
                thumbnailWidth: image.orig_width,
                thumbnailHeight: image.orig_height,
                posX: image.pos_x !== undefined ? image.pos_x : Math.floor(Math.random() * (width - 200)),
                posY: image.pos_y !== undefined ? image.pos_y : Math.floor(Math.random() * (height - 200)),
                isSelected: false,
                medium: image.medium,
                sourceUrl: image.sourceUrl,
                type: image.type,
                specific: image.specific,
                orig_width: image.orig_width,
                orig_height: image.orig_height,
                curr_width: image.curr_width,
                curr_height: image.curr_height,
                elementSourceUrl: image.elementSourceUrl
            }))
        );
        // give signal to contents
        setMarkedImage(false);
    }, [data.images]);

    useEffect(() => {
        // get the images that already registered, and mark as checked if it is a same source
        !markedImage && contents.length > 0 && checkExistingImages();
    }, [contents, markedImage]);

    const checkExistingImages = async () => {
        try {
            const { status, whiteboard_data } = await (await Axios.get(SERVER + '/whiteboard/user_data')).data;
            if (!status) throw new Error('Error occured while fetching whiteboard user data');
            // add whiteboard data url into the set
            const idSet = new Set();
            whiteboard_data.forEach(({ id }) => {
                idSet.add(id);
            });
            // check the url using previous set if it should be marked or not
            setContents(
                contents.map(image => {
                    if (idSet.has(image.id)) {
                        image.isSelected = true;
                    }
                    return image;
                })
            );
            setData({
                ...data,
                existing: whiteboard_data,
                selected: contents.filter(content => content.isSelected)
            });
            setMarkedImage(true);
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
                // fetching contents
                const contentsData = userData[element.contents];
                setData({
                    ...data,
                    images: (
                        contentsData.map(content => (
                            {
                                id: content.id ? content.id : uuidv4(),
                                medium: element.medium,
                                src: content.raw_content_url,
                                thumbnail: content.raw_content_url,
                                orig_width: content.orig_width,
                                orig_height: content.orig_height,
                                type: content.type,
                                sourceUrl: content[element.sourceUrl],
                                specific: element.specific,
                                elementSourceUrl: element.sourceUrl,
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
    }


    const onSelectImage = index => {
        const img = contents[index];
        img.isSelected = !img.isSelected;
        // everything based on src
        // find existing index
        const existingIndex = data.existing.findIndex(elem => elem.id === img.id) !== -1;
        if (img.isSelected) {
            // selected
            // check if it is in existing one, if it is, then erase from delete, if it is not, then add the object to add state
            if (existingIndex) {
                setData({ ...data, delete: data.delete.filter(elem => elem.id !== img.id) });
            } else {
                setData({ ...data, new: [...data.new, img] });
            }
        } else {
            // unselect
            // check existing one, if it exists, then add into delete, if it is not, then erase from add
            if (existingIndex) {
                setData({ ...data, delete: [...data.delete, img] });
            } else {
                setData({ ...data, new: data.new.filter(elem => elem.id !== img.id) });
            }
        }
        setData(data => ({ ...data, selected: contents.filter(content => content.isSelected) }));
        setContents(contents);
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
                {markedImage && (
                    <Gallery
                        images={contents}
                        onSelectImage={onSelectImage}
                        backdropClosesModal={true}
                    />
                )}
            </div>
            <div className="fixed-bottom card-footer bg-secondary d-flex justify-content-center" style={{ opacity: 0.9 }}>
                <button className="btn btn-danger mx-auto" onClick={previous}>Cancel</button>
                <button className="btn btn-primary mx-auto" onClick={next}>Done</button>
            </div>
        </Fragment>
    );
}

export default Contents;
