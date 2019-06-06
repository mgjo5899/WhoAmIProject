import React, { useEffect, useState, Fragment } from 'react';
import Axios from 'axios';
import { SERVER } from '../config';
import { Modal } from 'reactstrap';
import PlayButton from '../images/playbutton/play-button.png';


const Test = () => {

    const [contents, setContents] = useState([]);
    const [width, setWidth] = useState(0);
    const [modal, setModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    // load images
    useEffect(() => {
        fetchImage();
        setWidth(document.getElementById('media-container').offsetWidth);
        window.addEventListener('resize', () => {
            setWidth(document.getElementById('media-container').offsetWidth);
        });
    }, []);

    //fetch image function
    const fetchImage = async () => {
        // fetch data in the link
        try {
            const userData = (await Axios.get(SERVER + '/instagram/user_data')).data;
            if (!userData.status) throw new Error(userData.message);
            console.log(userData)
            setContents(userData.contents);
            // fetching contents
            // const contentsData = userData.contents;
            // contentsData.forEach(content => {
            //     if (content.type === 'video') {
            //         setVideoUrlList(videoUrlList => [...videoUrlList, content.raw_content_url]);
            //     }
            // });
            // setData({
            //     ...data,
            //     images: (
            //         contentsData.map(content => (
            //             {
            //                 id: content.id || uuidv4(),
            //                 medium: element.medium,
            //                 type: content.type,
            //                 pos_x: content.pos_x,
            //                 pos_y: content.pos_y,
            //                 specifics: {
            //                     orig_width: content.orig_width,
            //                     orig_height: content.orig_height,
            //                     raw_content_url: content.raw_content_url,
            //                     content_url: content.content_url,
            //                     curr_width: content.curr_width,
            //                     curr_height: content.curr_height
            //                 }
            //             }
            //         ))
            //     )
            // });
        } catch (error) {
            console.log(error);
        }
    }

    const mediaRender = contents => {
        const mediaGroup = [];
        for (let i = 0; i < contents.length; i += 3) {
            mediaGroup.push(contents.slice(i, i + 3));
        }

        return mediaGroup.map((group, key) => (
            <div key={key} className="row mx-auto">
                {group.map((content, key) => tagMap(content, key))}
            </div>
        ));
    }

    const toggle = () => {
        setModal(!modal);
        setModalContent(null);
    }

    const handleImageClick = e => {
        toggle();
        e.persist();
        setModalContent(
            <div className="d-flex" onClick={() => window.open(e.target.src)}>
                <img src={e.target.src} alt="" className="w-100 h-100" />
            </div>
        )
    }

    const handleVideoClick = e => {
        toggle();
        e.persist();
        setModalContent(
            <div className="d-flex" onClick={() => window.open(e.target.previousSibling.src)}>
                <video src={e.target.previousSibling.src} className="w-100 h-100" controls />
            </div>
        )
    }

    const tagMap = (content, key) => {

        const tagElement = {
            image: <img onClick={handleImageClick} className="w-100 h-100" draggable={false} src={content.raw_content_url} alt="" />,
            video: (
                <Fragment>
                    <video className="w-100 h-100" src={content.raw_content_url} onClick={e => { e.target.play(); e.target.muted = true }} />
                    <img
                        className="position-absolute mx-auto my-auto"
                        draggable={false} src={PlayButton}
                        style={{ left: 0, right: 0, top: 0, bottom: 0, cursor: 'pointer', width: 50, opacity: 0.5 }}
                        alt=""
                        onMouseEnter={e => { e.target.style.opacity = 1 }}
                        onMouseLeave={e => { e.target.style.opacity = 0.5 }}
                        onClick={handleVideoClick}
                    />
                </Fragment>
            )
        }

        const elementWidth = 30 / 100 * width;

        return (
            <div className="d-inline-block mt-1 mr-1 p-0 d-flex position-relative" style={{ width: elementWidth, height: elementWidth, backgroundColor: 'black', cursor: 'pointer' }} key={key}>
                {tagElement[content.type]}
                <span
                    className="border-white rounded-circle position-absolute"
                    style={{ backgroundColor: 'rgba(255,255,255,0.5)', borderWidth: 2, borderStyle: 'solid', width: 50, height: 50, top: '4%', right: '4%', cursor: 'pointer' }}
                    onClick={handleSelectImage}
                />
            </div>
        );
    }

    const handleSelectImage = e => {
        console.log(e.target.getAttribute('selected'))
        // if it is not selected, select the image
        if (!e.target.getAttribute('selected') || e.target.getAttribute('selected') === 'false') {
            e.target.setAttribute('selected', true);
            e.target.className = "border-white rounded-circle position-absolute bg-primary"
            // make whole profile background into less opaque
            e.target.previousSibling.style.opacity = 0.5;
        } else {
            // if it is selected, deselect the image
            e.target.setAttribute('selected', false);
            e.target.className = "border-white rounded-circle position-absolute"
            e.target.previousSibling.style.opacity = 1;
        }
        // e.target.setAttribute(selected,true);
        // console.log(e.target.parentElement)
    }

    // mediaRender(contents);

    return (
        <Fragment>
            <Modal isOpen={modal} toggle={toggle} contentClassName="border-0" centered={true}>
                {modalContent}
            </Modal>
            <div id="media-container" className="container">
                {mediaRender(contents)}
            </div>
        </Fragment>
        // videoUrlList.map((videoUrl, index) => (
        //     <video key={index} src={videoUrl} autoPlay={true} muted={true} loop={true} />
        // ))
    )
}

export default Test;