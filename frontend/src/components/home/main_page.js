import React, { useState, Fragment } from 'react';
import { Carousel, CarouselItem } from 'reactstrap';
import Dashboard from '../dashboard/Dashboard';
import ConnectTo from '../dashboard/ConnectTo';
import Spread from '../dashboard/Spread';
import Contents from '../dashboard/Contents';
import Navbar from '../layout/navbar';

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
        <Dashboard {...props} defaultWidth={defaultWidth} defaultHeight={defaultHeight} resetData={resetData} username={match.params.username} />,
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