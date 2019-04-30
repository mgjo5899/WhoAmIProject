import React, { Fragment, useState, useEffect } from 'react';
import Navbar from '../layout/navbar';
import { connect } from 'react-redux';
import { CarouselItem, Carousel } from 'reactstrap';
import Form from './form';
import Spread from '../dashboard/spread';
import { next, previous } from '../../store/actions/carousel_actions';
import { showImages, getExistingImages, setData } from '../../store/actions/data_actions';
import uuidv4 from 'uuid/v4';
import Axios from 'axios';
import { SERVER } from '../../config';

const Profile = ({ auth, activeIndex, next, previous, data, setData, getExistingImages, history }) => {

    const [profileData, setProfileData] = useState({
        profile_image_url: '',
        bio: '',
        company: '',
        location: '',
        website: ''
    });
    const [defaultWidth, defaultHeight] = [1000, 500];
    const [loaded, setLoaded] = useState(null);
    const [backup, setBackup] = useState(null);

    const setExistingProfileData = async () => {
        const { profile } = (await Axios.get(SERVER + '/user/profile')).data
        setProfileData({
            ...profileData,
            ...profile
        });
        const profileForm = document.getElementById('profile-form');
        for (const key in profile) {
            if (key !== 'id') profileForm[key].value = profile[key];
        }
    }

    const deleteProfile = profile => {
        const existingIndex = data.existing.findIndex(elem => elem.id === profile.id) !== -1;
        console.log(existingIndex)
        if (existingIndex) {
            console.log(profile)
            setData({ delete: [...data.delete, profile] });
        } else {
            setData({ new: data.new.filter(elem => elem.id !== profile.id) });
        }
        setData({ selected: data.selected.filter(selectedData => selectedData.id !== profile.id) });
    }

    const getProfileSelectedBackUp = () => {
        setBackup({
            delete: [...data.delete],
            selected: [...data.selected],
            new: [...data.new]
        });
    }

    useEffect(() => {
        switch (activeIndex) {
            case contentsIndex.profile:
                setLoaded(false);
                getProfileSelectedBackUp();
                (async () => {
                    await setExistingProfileData();
                    await getExistingImages(auth, auth.user.username, history);
                    setLoaded(true);
                })();
                break;
            case contentsIndex.spread:
                break;
            default:
                break;
        }
    }, [activeIndex]);

    useEffect(() => {
        if (loaded) {
            // when data exists, execute the command, giving conditions to useEffect
            if (backup.selected.length > 0) {
                setData(backup);
            } else {
                const existingProfileData = data.existing.find(existingData => existingData.type === 'profile');
                console.log(existingProfileData)
                const profileElement = {
                    id: existingProfileData ? existingProfileData.id : uuidv4(),
                    posX: existingProfileData ? existingProfileData.pos_x : Math.floor(Math.random() * (defaultWidth - 200)),
                    posY: existingProfileData ? existingProfileData.pos_y : Math.floor(Math.random() * (defaultHeight - 200)),
                    medium: 'whoami',
                    type: 'profile',
                    specifics: {
                        orig_width: 200,
                        orig_height: 200,
                        curr_width: existingProfileData ? existingProfileData.specifics.curr_width : 200,
                        curr_height: existingProfileData ? existingProfileData.specifics.curr_height : 200,
                    },
                    selected: true
                };
                if (!existingProfileData) {
                    setData({ new: [...data.new, profileElement] });
                }
                setData({ selected: [...data.selected, profileElement] });
            }
        }
    }, [loaded]);

    const contentsIndex = {
        profile: 0,
        spread: 1,
    }

    // list of components to use programmatically
    const items = [
        <Form
            {...{
                profileData,
                setProfileData,
                auth,
                next
            }}
        />,
        <Spread
            {...{
                profile: profileData,
                showImages,
                next: () => history.push('/'),
                previous,
                data,
                defaultWidth,
                defaultHeight,
                activeIndex,
                contentsIndex,
                element: { medium: 'whoami' },
                setData,
                deleteImage: deleteProfile,
                flag: 2
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
