import React, { useState } from 'react';
import { Carousel, CarouselItem } from 'reactstrap';
import Dashboard from '../dashboard';
import ConnectTo from '../dashboard/ConnectTo';

const SignedInConfirmedHome = () => {

    const [activeIndex, setActiveIndex] = useState(0);

    const next = () => {
        setActiveIndex(1);
    }

    const previous = () => {
        setActiveIndex(0);
    }

    const props = {
        activeIndex,
        next,
        previous
    };

    const items = [<Dashboard {...props} />, <ConnectTo {...props} />];

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