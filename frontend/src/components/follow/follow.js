import React, { useState, useEffect } from 'react';
import FollowingFollowers from './following_followers';
import { CarouselItem, Carousel } from 'reactstrap';
import { Spread } from '../dashboard';
import uuidv4 from 'uuid/v4';
import { DEFAULT_WIDTH, DEFAULT_HEIGHT, DEFAULT_SUBTRACTING_VALUE } from '../../config';

const Follow = ({ data, setData, updateData, deleteData, showImages, getExistingImages, auth, history }) => {

    const [backup, setBackup] = useState({
        delete: [],
        selected: [],
        new: []
    });
    const [activeIndex, setActiveIndex] = useState(0);

    const next = () => {
        setActiveIndex((activeIndex + 1) % 2);
    }

    const previous = () => {
        setActiveIndex((((activeIndex - 1) % 2) + 2) % 2);
    }

    const deleteFollow = follow => {
        const existingIndex = data.existing.findIndex(elem => elem.id === follow.id) !== -1;
        if (existingIndex) {
            setData({ delete: [...data.delete, follow] });
        } else {
            setData({ new: data.new.filter(elem => elem.id !== follow.id) });
        }
        setData({ selected: data.selected.filter(selectedData => selectedData.id !== follow.id) });
    }

    const selectedBackup = () => {
        setBackup({
            delete: [...data.delete],
            selected: [...data.selected],
            new: [...data.new]
        });
    }

    useEffect(() => {
        if (activeIndex === contentsIndex.following_followers) {
            selectedBackup();
            getExistingImages(auth, auth.user.username, history);
        }
    }, [activeIndex]);

    useEffect(() => {
        // when data exists, execute the command, giving conditions to useEffect
        if (backup.selected.length > 0) {
            setData(backup);
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
                },
                selected: true
            };
            if (!existingFollowData) {
                setData({ new: [...data.new, followElement] });
            }
            setData({ selected: [...data.selected, followElement] });
        }
    }, [data.existing]);

    const contentsIndex = {
        following_followers: 0,
        spread: 1
    }

    // list of components to use programmatically
    const items = [
        <FollowingFollowers
            {...{
                next,
                previous
            }}
        />,
        <Spread
            {...{
                showImages,
                next,
                previous,
                data,
                activeIndex,
                contentsIndex,
                element: { medium: 'whoami' },
                setData,
                deleteImage: deleteFollow,
                flag: 3,
                updateData,
                deleteData
            }}
        />
    ];

    const slides = items.map((item, index) => (
        <CarouselItem key={index}>
            {item}
        </CarouselItem>
    ))

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