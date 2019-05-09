import React, { Fragment, useState, useEffect } from 'react';
import Navbar from '../layout/navbar';
import { connect } from 'react-redux';
import { CarouselItem, Carousel } from 'reactstrap';
import Form from './form';
import { next, previous } from '../../store/actions/carousel_actions';
import { showImages, getExistingImages, setData } from '../../store/actions/data_actions';
import { setExistingProfileData, setProfile } from '../../store/actions/profile_actions';
import uuidv4 from 'uuid/v4';
import { DEFAULT_WIDTH, DEFAULT_HEIGHT, DEFAULT_SUBTRACTING_VALUE } from '../../config';
import signedInSecure from '../../secure/signed_in_secure';
import { ConnectTo, Spread } from '../dashboard';
import ProfileContents from './profile_contents';

const Profile = ({ profile, auth, activeIndex, next, previous, data, setData, getExistingImages, history, setExistingProfileData, setProfile }) => {

    const [loaded, setLoaded] = useState(false);
    // const [profileLoaded, setProfileLoaded] = useState(false);
    const [backup, setBackup] = useState(null);
    const [element, setElement] = useState(null);
    const [profileUrlBackup, setProfileUrlBackup] = useState(null);

    const deleteProfile = profile => {
        const existingIndex = data.existing.findIndex(elem => elem.id === profile.id) !== -1;
        if (existingIndex) {
            setData({ delete: [...data.delete, profile] });
        } else {
            setData({ new: data.new.filter(elem => elem.id !== profile.id) });
        }
        setData({ selected: data.selected.filter(selectedData => selectedData.id !== profile.id) });
    }

    useEffect(() => {
        signedInSecure({ auth, history }, '/');
    }, []);

    const getProfileSelectedBackUp = () => {
        setBackup({
            delete: [...data.delete],
            selected: [...data.selected],
            new: [...data.new]
        });
        setProfileUrlBackup({ profile_image_url: profile.profile_image_url });
    }

    useEffect(() => {
        if (activeIndex === contentsIndex.profile) {
            setLoaded(false);
            getProfileSelectedBackUp();
            (async () => {
                await setExistingProfileData();
                await getExistingImages(auth, auth.user.username, history);
                setLoaded(true);
            })();
        }
    }, [activeIndex]);

    useEffect(() => {
        if (loaded) {
            // when data exists, execute the command, giving conditions to useEffect
            if (backup.selected.length > 0) {
                setData(backup);
                setProfile(profileUrlBackup);
            } else {
                const existingProfileData = data.existing.find(existingData => existingData.type === 'profile');
                const profileElement = {
                    id: existingProfileData ? existingProfileData.id : uuidv4(),
                    posX: existingProfileData ? existingProfileData.pos_x : Math.floor(Math.random() * (DEFAULT_WIDTH - DEFAULT_SUBTRACTING_VALUE)),
                    posY: existingProfileData ? existingProfileData.pos_y : Math.floor(Math.random() * (DEFAULT_HEIGHT - DEFAULT_SUBTRACTING_VALUE)),
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
                    setData({ new: [...data.new, profileElement] });
                }
                setData({ selected: [...data.selected, profileElement] });
            }
        }
    }, [loaded]);

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
                profile,
                showImages,
                next: () => history.push('/'),
                previous: next,
                data,
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
                    keyboard={false}
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
    data: state.data,
    profile: state.profile
})

const mapDispatchToProps = dispatch => ({
    next: () => dispatch(next('PROFILE')),
    previous: () => dispatch(previous('PROFILE')),
    getExistingImages: (auth, username, history) => dispatch(getExistingImages(auth, username, history)),
    setData: data => dispatch(setData(data)),
    setExistingProfileData: () => dispatch(setExistingProfileData()),
    setProfile: profile => dispatch(setProfile(profile))
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
