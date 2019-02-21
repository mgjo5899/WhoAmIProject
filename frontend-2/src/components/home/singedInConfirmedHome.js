import React, { useState } from 'react';
import { Carousel, CarouselItem } from 'reactstrap';
import Dashboard from '../dashboard/Dashboard';
import ConnectTo from '../dashboard/ConnectTo';
import SelectContents from '../dashboard/SelectContents';

const SignedInConfirmedHome = () => {

    const [activeIndex, setActiveIndex] = useState(0);
    const [element, setElement] = useState(null);

    const next = () => {
        activeIndex + 1 === items.length ? setActiveIndex(0) : setActiveIndex(activeIndex + 1);
    }

    const previous = () => {
        activeIndex === 0 ? setActiveIndex(items.length - 1) : setActiveIndex(activeIndex - 1);
    }

    const pickedElement = elem => {
        setElement(elem);
        next();
    }

    const props = {
        next,
        previous
    };

    const items = [<Dashboard {...props} />, <ConnectTo {...props} pickedElement={pickedElement} />, <SelectContents {...props} element={element} />];

    const slides = items.map((item, index) => (
        <CarouselItem key={index}>
            {item}
        </CarouselItem>
    ));

    return (
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
    );
}

export default SignedInConfirmedHome;