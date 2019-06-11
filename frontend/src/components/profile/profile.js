import React, { Fragment, useState, useEffect } from 'react';
import { CarouselItem, Carousel } from 'reactstrap';
import Form from './form';
import uuidv4 from 'uuid/v4';
import { DEFAULT_WIDTH, DEFAULT_HEIGHT, DEFAULT_SUBTRACTING_VALUE, SERVER } from '../../config';
import { ConnectTo, Spread } from '../dashboard';
import ProfileContents from './profile_contents';
import Axios from 'axios';

const Profile = ({ auth, showImages, images, setImages }) => {

    const [loaded, setLoaded] = useState(false);
    const [element, setElement] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);


    const [profile, setProfile] = useState({
        profile_image_url: '',
        bio: '',
        company: '',
        location: '',
        website: '',
        include_email: true
    });

    const resetData = () => ({
        new: [],
        images: [],
        existing: [],
        delete: [],
        selected: []
    });

    const [data, setData] = useState(resetData());

    const setExistingProfileData = async () => {
        if (!loaded) {
            const { profile: profileData } = (await Axios.get(SERVER + '/user/profile')).data;
            if (profileData) {
                setProfile({ ...profile, ...profileData, include_email: profileData.email ? true : false });
            }
        }
    }

    const deleteProfile = profile => {
        const existingIndex = data.existing.findIndex(elem => elem.id === profile.id) !== -1;
        if (existingIndex) {
            setData(data => ({ ...data, delete: [...data.delete, profile] }));
        } else {
            setData(data => ({ ...data, new: data.new.filter(elem => elem.id !== profile.id) }));
        }
        setData(data => ({ ...data, selected: data.selected.filter(selectedData => selectedData.id !== profile.id) }));
    }

    const next = () => {
        setActiveIndex(activeIndex => (activeIndex + 1) % 4);
    }

    const previous = () => {
        setActiveIndex(activeIndex => ((activeIndex - 1) + 4) % 4);
    }

    useEffect(() => {
        if (activeIndex === contentsIndex.profile) {
            setLoaded(false);
            setData(resetData());
            // getProfileSelectedBackUp();
            (async () => {
                await setExistingProfileData();
                await getOwnerExistingImages();
                setLoaded(true);
            })();
        }
    }, [activeIndex]);

    const getOwnerExistingImages = async () => {
        const { status, whiteboard_data, message } = (await Axios.get(SERVER + '/whiteboard/user_data')).data;
        if (!status) throw new Error(message);
        setData(data => ({
            ...data,
            existing: whiteboard_data,
            selected: whiteboard_data
        }));
    }

    useEffect(() => {
        if (loaded) {
            const existingProfileData = data.existing.find(existingData => existingData.type === 'profile');
            const profileElement = {
                id: existingProfileData ? existingProfileData.id : uuidv4(),
                pos_x: existingProfileData ? existingProfileData.pos_x : Math.floor(Math.random() * (DEFAULT_WIDTH - DEFAULT_SUBTRACTING_VALUE)),
                pos_y: existingProfileData ? existingProfileData.pos_y : Math.floor(Math.random() * (DEFAULT_HEIGHT - DEFAULT_SUBTRACTING_VALUE)),
                medium: 'whoami',
                type: 'profile',
                specifics: {
                    orig_width: 150,
                    orig_height: 150,
                    curr_width: existingProfileData ? existingProfileData.specifics.curr_width : 150,
                    curr_height: existingProfileData ? existingProfileData.specifics.curr_height : 150,
                },
                selected: true
            };
            if (!existingProfileData) {
                setData(data => ({ ...data, new: [...data.new, profileElement] }));
                setData(data => ({ ...data, selected: [...data.selected, profileElement] }));
            }
        }
    }, [loaded]);

    useEffect(() => {
        setImages(showImages(data.selected, deleteProfile, 2));
    }, [data.selected]);

    const contentsIndex = {
        profile: 0,
        connect_to: 1,
        contents: 2,
        spread: 3
    }

    // list of components to use programmatically
    const items = [
        <Form
            {...{
                profile,
                setProfile,
                auth,
                next,
                previous
            }}
        />,
        <ConnectTo
            {...{
                next,
                previous,
                setElement,
                activeIndex,
                contentsIndex
            }}
        />,
        <ProfileContents
            {...{
                profile,
                setProfile,
                next,
                previous,
                element,
                activeIndex,
                contentsIndex,
            }}
        />,
        <Spread
            {...{
                next,
                previous: next,
                data,
                activeIndex,
                contentsIndex,
                element: { medium: 'whoami' },
                setData,
                images
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
            <Carousel
                activeIndex={activeIndex}
                next={next}
                previous={previous}
                interval={false}
                keyboard={false}
            >
                {slides}
            </Carousel>
        </Fragment>
    );
}

export default Profile;
