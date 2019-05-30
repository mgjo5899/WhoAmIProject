import React, { useState, useEffect } from 'react';
import FollowingFollowers from './following_followers';
import { CarouselItem, Carousel } from 'reactstrap';
import { Spread } from '../dashboard';
import uuidv4 from 'uuid/v4';
import { DEFAULT_WIDTH, DEFAULT_HEIGHT, DEFAULT_SUBTRACTING_VALUE, SERVER } from '../../config';
import Axios from 'axios';
import { getFollowers, getFollowingUsers } from '../../store/actions/data_actions';

const Follow = ({ auth }) => {

    const [backup, setBackup] = useState({
        delete: [],
        selected: [],
        new: []
    });
    const [activeIndex, setActiveIndex] = useState(0);

    const resetData = () => ({
        new: [],
        images: [],
        existing: [],
        delete: [],
        selected: []
    });

    const [data, setData] = useState(resetData());
    const [loaded, setLoaded] = useState(false);

    const [numberOfFollowers, setNumberOfFollowers] = useState(0);
    const [numberOfFollowingUsers, setNumberOfFollowingUsers] = useState(0);

    const next = () => {
        setActiveIndex(activeIndex => (activeIndex + 1) % 2);
    }

    const previous = () => {
        setActiveIndex(activeIndex => ((activeIndex - 1) + 2) % 2);
    }

    const deleteFollow = follow => {
        const existingIndex = data.existing.findIndex(elem => elem.id === follow.id) !== -1;
        if (existingIndex) {
            setData(data => ({ ...data, delete: [...data.delete, follow] }));
        } else {
            setData(data => ({ ...data, new: data.new.filter(elem => elem.id !== follow.id) }));
        }
        setData(data => ({ ...data, selected: data.selected.filter(selectedData => selectedData.id !== follow.id) }));
    }

    const selectedBackup = () => {
        setBackup({
            delete: [...data.delete],
            selected: [...data.selected],
            new: [...data.new]
        });
    }

    const contentsIndex = {
        following_followers: 0,
        spread: 1
    }

    useEffect(() => {
        if (activeIndex === contentsIndex.following_followers) {
            setLoaded(false);
            selectedBackup();
            (async () => {
                await getOwnerExistingImages();
                setNumberOfFollowers((await getFollowers(auth.user.username)).length);
                setNumberOfFollowingUsers((await getFollowingUsers(auth.user.username)).length);
                setLoaded(true);
            })();
        }
    }, [activeIndex]);

    useEffect(() => {
        if (loaded) {
            // when data exists, execute the command, giving conditions to useEffect
            if (backup.selected.length > 0) {
                setData(data => ({ ...data, ...backup }));
            } else {
                const existingFollowData = data.existing.find(existingData => existingData.type === 'follow');
                const followElement = {
                    id: existingFollowData ? existingFollowData.id : uuidv4(),
                    posX: existingFollowData ? existingFollowData.pos_x : Math.floor(Math.random() * (DEFAULT_WIDTH - DEFAULT_SUBTRACTING_VALUE)),
                    posY: existingFollowData ? existingFollowData.pos_y : Math.floor(Math.random() * (DEFAULT_HEIGHT - DEFAULT_SUBTRACTING_VALUE)),
                    medium: 'whoami',
                    type: 'follow',
                    specifics: {
                        orig_width: 150,
                        orig_height: 150,
                        curr_width: existingFollowData ? existingFollowData.specifics.curr_width : 150,
                        curr_height: existingFollowData ? existingFollowData.specifics.curr_height : 150,
                        number_of_followers: numberOfFollowers,
                        number_of_following_users: numberOfFollowingUsers
                    },
                    selected: true
                };
                if (!existingFollowData) {
                    setData(data => ({ ...data, new: [...data.new, followElement] }));
                    setData(data => ({ ...data, selected: [...data.selected, followElement] }));
                }
            }
        }

    }, [loaded]);

    const getOwnerExistingImages = async () => {
        const data = (await Axios.get(SERVER + '/whiteboard/user_data')).data;
        const { status, whiteboard_data, message } = data;
        if (!status) throw new Error(message);
        setData(resetData());
        setData(data => ({
            ...data,
            existing: whiteboard_data
        }));
    }

    let items = [];
    let slides = [];

    if (loaded) {
        items = [
            <FollowingFollowers
                {...{
                    next,
                    previous,
                    activeIndex,
                    contentsIndex,
                    auth,
                    username: auth.user.username
                }}
            />,
            <Spread
                {...{
                    next,
                    previous,
                    data,
                    activeIndex,
                    contentsIndex,
                    element: { medium: 'whoami' },
                    setData,
                    deleteImage: deleteFollow,
                    flag: 3
                }}
            />
        ];

        slides = items.map((item, index) => (
            <CarouselItem key={index}>
                {item}
            </CarouselItem>));
    }

    return (
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
    );
}

export default Follow;