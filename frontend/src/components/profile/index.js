import React, { Fragment, useState } from 'react';
import Navbar from '../layout/navbar';
import { connect } from 'react-redux';
import { CarouselItem, Carousel } from 'reactstrap';
import Form from './form';
import Spread from '../dashboard/Spread';
import { next, previous } from '../../store/actions/carousel_actions';

const Profile = ({ auth, activeIndex, next, previous }) => {

    const [profile, setProfile] = useState({
        bio: '',
        company: '',
        location: '',
        website: ''
    });

    const handleChange = e => {
        e.persist();
        setProfile(profile => ({
            ...profile,
            [e.target.id]: e.target.value
        }));
        console.log(profile)
    }

    // list of components to use programmatically
    const items = [
        <Form
            {...{
                handleChange,
                auth,
                next
            }}
        />,
        // <Spread
        //     {...{
        //         next,
        //         previous,

        //     }}
        // />
    ];

    const slides = items.map((item, index) => (
        <CarouselItem key={index}>
            {item}
        </CarouselItem>
    ))



    return (
        <Fragment>
            <Navbar />
            <div className="container w-50">
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

const mapStateToProps = state => ({
    auth: state.auth,
    activeIndex: state.carousel.profileActiveIndex
})

const mapDispatchToProps = dispatch => ({
    next: () => dispatch(next('PROFILE')),
    previous: () => dispatch(previous('PROFILE')),
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile);