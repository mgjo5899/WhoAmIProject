import React, { useState, Fragment } from 'react';
import { Carousel, CarouselItem } from 'reactstrap';
import Dashboard from '../dashboard/Dashboard';
import ConnectTo from '../dashboard/ConnectTo';
import Spread from '../dashboard/Spread';
import Contents from '../dashboard/Contents';
import Navbar from '../layout/navbar';
import { SOCIAL_MEDIA_CONFIG } from '../../config';

const MainPage = ({ match }) => {

    // this component contains many children components, which requires multiple states to use
    const [activeIndex, setActiveIndex] = useState(0);
    const [element, setElement] = useState(null);
    const [contents, setContents] = useState([]);

    const resetData = () => ({
        new: [],
        images: [],
        existing: [],
        delete: [],
        selected: []
    })

    const [data, setData] = useState(resetData());

    const contentsIndex = {
        dashboard: 0,
        connect_to: 1,
        contents: 2,
        spread: 3
    }

    const [defaultWidth, defaultHeight] = [1000, 500];

    const deleteImage = img => {
        // handle the case when it is not previously selected medium
        const selectedMedium = img.isSelected !== undefined;
        if (selectedMedium) img.isSelected = !img.isSelected;
        // everything based on src
        // find existing index
        const existingIndex = data.existing.findIndex(elem => elem.id === img.id) !== -1;
        if (!selectedMedium) {
            // if the image is not from the selected medium, and if the user clicks delete button, then add the image to delete data
            setData({ ...data, delete: [...data.delete, img] });
        } else if (img.isSelected) {
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
        // update to data and contents
        setData(data => ({ ...data, selected: contents.filter(content => content.isSelected) }));
        setContents(contents);
    }

    // moving to next slide
    const next = () => {
        activeIndex + 1 === items.length ? setActiveIndex(0) : setActiveIndex(activeIndex + 1);
    }

    // moving to previous slide
    const previous = () => {
        activeIndex === 0 ? setActiveIndex(items.length - 1) : setActiveIndex(activeIndex - 1);
    }

    // showing the images to the end users
    /**
     * 
     * @param {list} imageData - image data to show up
     * @param {function} clickFunc - operate function when click
     * @param {boolean} close - whether it has close button or not
     */
    const showImages = (imageData, clickFunc, close) => (
        imageData.map((image, index) => (
            <div
                id={image.id}
                medium={image.medium}
                orig_width={image.orig_width}
                orig_height={image.orig_height}
                className="card position-absolute rounded"
                key={index}
                style={{
                    width: image.curr_width || 200,
                    height: image.curr_height || 'auto',
                    WebkitTransform: `translate(${image.posX || image.pos_x}px, ${image.posY || image.pos_y}px)`,
                    transform: `translate(${image.posX || image.pos_x}px, ${image.posY || image.pos_y}px)`,
                    background: SOCIAL_MEDIA_CONFIG.find(socialMedia => socialMedia.medium === image.medium).backgroundBorderColor,
                    padding: 3
                }}
                data-x={image.posX || image.pos_x}
                data-y={image.posY || image.pos_y}
                onClick={!close ? (() => clickFunc(image)) : undefined}
            >
                {close && (
                    <button type="button" onClick={() => clickFunc(image)} className="close position-absolute" style={{ top: '2%', right: '2%' }} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                )}
                <img
                    className="w-100 h-100"
                    src={image.src || image.raw_content_url}
                    alt=""
                />
            </div>
        ))
    )

    // basic props to inherit
    const props = {
        next,
        previous,
        activeIndex,
        contentsIndex,
        data,
        setData
    };

    // list of components to use programmatically
    const items = [
        <Dashboard {...props} defaultWidth={defaultWidth} defaultHeight={defaultHeight} resetData={resetData} username={match.params.username} showImages={showImages} />,
        <ConnectTo {...props} setElement={setElement} />,
        <Contents
            {...props}
            element={element}
            contents={contents}
            setContents={setContents}
            deleteImage={deleteImage}
            defaultWidth={defaultWidth}
            defaultHeight={defaultHeight}
        />,
        <Spread
            {...props}
            defaultWidth={defaultWidth}
            defaultHeight={defaultHeight}
            deleteImage={deleteImage}
            element={element}
            showImages={showImages}
        />
    ];

    const slides = items.map((item, index) => (
        <CarouselItem key={index}>
            {item}
        </CarouselItem>
    ));

    return (
        <Fragment>
            <Navbar />
            <div className="container">
                <Carousel
                    activeIndex={activeIndex}
                    next={next}
                    previous={previous}
                    interval={false}
                >
                    {slides}
                </Carousel>
            </div>
        </Fragment>
    );
}

export default MainPage;