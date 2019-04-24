import React, { Fragment, useState, useEffect } from 'react';
import Navbar from '../layout/navbar';
import { connect } from 'react-redux';
import { CarouselItem, Carousel } from 'reactstrap';
import Form from './form';
import Spread from '../dashboard/Spread';
import { next, previous } from '../../store/actions/carousel_actions';
import { showImages, getExistingImages } from '../../store/actions/data_actions';
import uuidv4 from 'uuid/v4';

const Profile = ({ auth, activeIndex, next, previous, data, history }) => {

    const [profile, setProfile] = useState({
        bio: '',
        company: '',
        location: '',
        website: ''
    });

    const [profileElement, setProfileElement] = useState({});

    const handleChange = e => {
        e.persist();
        setProfile(profile => ({
            ...profile,
            [e.target.id]: e.target.value
        }));
        console.log(profile)
    }

    useEffect(() => {
        if (activeIndex === contentsIndex.profile) {
            getExistingImages(auth, auth.user.username, history);
        }
    }, [activeIndex])

    useEffect(() => {
        const profileData = data.existing.find(img => img.medium === 'profile');
        if (profileData) {
            const { bio, company, location, website } = profileData;
            setProfile({
                bio,
                company,
                location,
                website
            });
        }
        const [defaultWidth, defaultHeight] = [1000, 500];

        setProfileElement({
            id: profileData ? profileData.id : uuidv4(),
            posX: profileData ? profileData.pos_x : Math.floor(Math.random() * (defaultWidth - 200)),
            posY: profileData ? profileData.pos_y : Math.floor(Math.random() * (defaultHeight - 200)),
            medium: 'profile',
            orig_width: 200,
            orig_height: 200,
            curr_width: profileData ? profileData.curr_width : 200,
            curr_height: profileData ? profileData.curr_height : 200,
        })
    }, [data.existing]);

    const contentsIndex = {
        profile: 0,
        spread: 1,
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
        <Spread
            {...{
                next,
                previous,
                showImages,
                element: { medium: 'profile' },
                defaultWidth: 200,
                defaultHeight: 200,
                data,
                activeIndex,
                contentsIndex,
                profileElement
            }}
        />
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
    activeIndex: state.carousel.profileActiveIndex,
    data: state.data
})

const mapDispatchToProps = dispatch => ({
    next: () => dispatch(next('PROFILE')),
    previous: () => dispatch(previous('PROFILE')),
    getExistingImages: (auth, username, history) => dispatch(getExistingImages(auth, username, history))
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile);