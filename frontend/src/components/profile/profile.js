import React, { Fragment, useState, useEffect } from 'react';
import Navbar from '../layout/navbar';
import { connect } from 'react-redux';
import { CarouselItem, Carousel } from 'reactstrap';
import Form from './form';
import Spread from '../dashboard/spread';
import { next, previous } from '../../store/actions/carousel_actions';
import { showImages, getExistingImages, setData } from '../../store/actions/data_actions';
import { setExistingProfileData, setProfile } from '../../store/actions/profile_action';
import uuidv4 from 'uuid/v4';
import { DEFAULT_WIDTH, DEFAULT_HEIGHT, DEFAULT_SUBTRACTING_VALUE, DEFAULT_PROFILE_SIZE_VALUE } from '../../config';

const Profile = ({ profile, auth, activeIndex, next, previous, data, setData, getExistingImages, history, setExistingProfileData, setProfile }) => {

    const [loaded, setLoaded] = useState(null);
    const [backup, setBackup] = useState(null);

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
                    await setExistingProfileData(document);
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
        console.log(loaded)
        if (loaded) {
            // when data exists, execute the command, giving conditions to useEffect
            if (backup.selected.length > 0) {
                setData(backup);
            } else {
                const existingProfileData = data.existing.find(existingData => existingData.type === 'profile');
                console.log(existingProfileData)
                const profileElement = {
                    id: existingProfileData ? existingProfileData.id : uuidv4(),
                    posX: existingProfileData ? existingProfileData.pos_x : Math.floor(Math.random() * (DEFAULT_WIDTH - DEFAULT_SUBTRACTING_VALUE)),
                    posY: existingProfileData ? existingProfileData.pos_y : Math.floor(Math.random() * (DEFAULT_HEIGHT - DEFAULT_SUBTRACTING_VALUE)),
                    medium: 'whoami',
                    type: 'profile',
                    specifics: {
                        orig_width: DEFAULT_PROFILE_SIZE_VALUE,
                        orig_height: DEFAULT_PROFILE_SIZE_VALUE,
                        curr_width: existingProfileData ? existingProfileData.specifics.curr_width : DEFAULT_PROFILE_SIZE_VALUE,
                        curr_height: existingProfileData ? existingProfileData.specifics.curr_height : DEFAULT_PROFILE_SIZE_VALUE,
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
                next: () => history.push('/'),
                previous,
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
