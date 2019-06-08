import React, { useState, Fragment } from 'react';
import { Carousel, CarouselItem } from 'reactstrap';
import { Dashboard, ConnectTo, Contents, Spread } from '../dashboard';
import Navbar from '../layout/navbar';

const MainPage = ({ match }) => {

    // this component contains many children components, which requires multiple states to use
    const [element, setElement] = useState(null);
    const [prevElementMedium, setPrevElementMedium] = useState(null);
    const resetData = () => ({
        new: [],
        images: [],
        existing: [],
        delete: [],
        selected: []
    });
    const [data, setData] = useState(resetData());
    const [activeIndex, setActiveIndex] = useState(0);
    const [images, setImages] = useState([]);

    const next = () => {
        setActiveIndex((activeIndex + 1) % 4);
    }

    const previous = () => {
        setActiveIndex(((activeIndex - 1) + 4) % 4);
    }

    const contentsIndex = {
        dashboard: 0,
        connect_to: 1,
        contents: 2,
        spread: 3
    }
    const deleteImage = img => {
        const existingIndex = data.existing.findIndex(elem => elem.id === img.id) !== -1;
        const selected = data.selected.findIndex(selected => selected.id === img.id) !== -1;
        // if selected, check if it is original data or not
        // if it is not original data, just erase from selected data
        // if it is original data, remove from selected, and also put the data into delete list
        // originally data exists
        if (existingIndex) {
            if (selected) {
                // if it is selected
                // then deselect the data, then put add in the delete list
                setData(data => ({ ...data, delete: [...data.delete, img], selected: data.selected.filter(selected => selected.id !== img.id) }));
            } else {
                // then put it into the select list, and remove from delete list
                setData(data => ({ ...data, delete: data.delete.filter(elem => elem.id !== img.id), selected: [...data.selected, img] }));
            }
        } else {
            // if it is the newly data, not stored in the database
            if (selected) {
                // if it is selected, then remove from new, then remove from select list
                setData(data => ({ ...data, new: data.new.filter(elem => elem.id !== img.id), selected: data.selected.filter(selected => selected.id !== img.id) }));
            } else {
                // if it is not selected, then add to new list, and the select list
                setData(data => ({ ...data, new: [...data.new, img], selected: [...data.selected, img] }));
            }
        }
        setImages(images => images.filter(image => image.props.id !== img.id));
    }

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
        <Dashboard
            {...{
                ...props,
                resetData,
                username: match.params.username,
                images,
                setImages,
                setPrevElementMedium
            }}
        />,
        <ConnectTo {...props} setElement={setElement} />,
        <Contents
            {...{
                ...props,
                element,
                deleteImage,
                setImages,
                flag: 1,
                prevElementMedium,
                setPrevElementMedium
            }}
        // element={element}
        // deleteImage={deleteImage}
        />,
        <Spread
            {...{
                ...props,
                deleteImage,
                element,
                setData,
                flag: 1,
                images,
                setImages
            }}
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
            <div id="main-container" className="container">
                <Carousel
                    activeIndex={activeIndex}
                    next={next}
                    previous={previous}
                    interval={false}
                    keyboard={false}
                >
                    {slides}
                </Carousel>
            </div>
        </Fragment>
    );
}

export default MainPage;