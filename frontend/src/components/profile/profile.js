import React, { Fragment, useState, useEffect } from 'react';
import Navbar from '../layout/navbar';
import { connect } from 'react-redux';
import { CarouselItem, Carousel } from 'reactstrap';
import Form from './form';
import Spread from '../dashboard/spread';
import { next, previous } from '../../store/actions/carousel_actions';
import { showImages, getExistingImages, setData } from '../../store/actions/data_actions';
import uuidv4 from 'uuid/v4';

const Profile = ({ auth, activeIndex, next, previous, data, history, setData, getExistingImages }) => {

    const [profile, setProfile] = useState({
        data: {
            profile_image_url: '',
            bio: '',
            company: '',
            location: '',
            website: ''
        },
        element: {}
    });
    const [defaultWidth, defaultHeight] = [1000, 500];

    useEffect(() => {
        if (activeIndex === contentsIndex.profile) {
            // if there is profile data available, then copy it to the value of it
            getExistingImages(auth, auth.user.username, history);
        }
    }, [activeIndex]);

    useEffect(() => {
        // when data exists, execute the command, giving conditions to useEffect
        if (data.existing.length !== 0) {
            const profileData = data.existing.find(img => img.medium === 'whoami' && img.type === 'profile');
            if (profileData) {
                const { bio, company, location, website } = profileData;
                setProfile({
                    ...profile,
                    data: {
                        ...profile.data,
                        bio,
                        company,
                        location,
                        website
                    }
                });
            }
            setProfile(profile => ({
                ...profile,
                element: {
                    id: profileData ? profileData.id : uuidv4(),
                    posX: profileData ? profileData.pos_x : Math.floor(Math.random() * (defaultWidth - 200)),
                    posY: profileData ? profileData.pos_y : Math.floor(Math.random() * (defaultHeight - 200)),
                    medium: 'whoami',
                    type: 'profile',
                    orig_width: 200,
                    orig_height: 200,
                    curr_width: profileData ? profileData.curr_width : 200,
                    curr_height: profileData ? profileData.curr_height : 200,
                    selected: true
                }
            }))
        }
    }, [data.existing]);

    const contentsIndex = {
        profile: 0,
        spread: 1,
    }

    // list of components to use programmatically
    const items = [
        <Form
            {...{
                profile,
                setProfile,
                auth,
                next
            }}
        />,
        <Spread
            {...{
                profile,
                showImages,
                next,
                previous,
                data,
                defaultWidth,
                defaultHeight,
                activeIndex,
                contentsIndex,
                element: { medium: 'whoami' },
                setData
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
    getExistingImages: (auth, username, history) => dispatch(getExistingImages(auth, username, history)),
    setData: data => dispatch(setData(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile);