import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { SERVER } from '../config';


const Test = () => {

    // const [markedImage, setMarkedImage] = useState(false);
    // const [spinner, setSpinner] = useState(false);
    const [videoUrlList, setVideoUrlList] = useState([]);
    // const [gallery, setGallery] = useState(null);

    const [contents, setContents] = useState([]);

    // load images
    useEffect(() => {
        fetchImage();
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
            <div key={key} className="row">
                {group.map((content, key) => tagMap(content, key))}
            </div>
        ));
    }

    const tagMap = (content, key) => {

        const tagElement = {
            image: <img className="w-100 h-100" src={content.raw_content_url} alt={undefined} />,
            video: <video className="w-100 h-100" src={content.raw_content_url} alt={undefined} autoPlay={true} muted={true} loop={true} />,
        }

        // const elem = <div className="col-3 d-inline-block mb-1 mr-1 p-0" key={key}>{tagElement[content.type]}</div>

        // console.log(elem.offsetWidth);

        const width = 25 / 100 * window.innerWidth;

        return (
            <div className="d-inline-block mb-1 mr-1 p-0 col-3" key={key}>
                {tagElement[content.type]}
                <span className="border-white rounded-circle position-absolute" style={{ backgroundColor: 'rgba(255,255,255,0.5)', borderWidth: 2, borderStyle: 'solid', width: 50, height: 50, top: '4%', right: '4%' }}></span>
            </div>
        );
    }

    // mediaRender(contents);

    return (
        <div className="container">
            {mediaRender(contents)}
        </div>
        // videoUrlList.map((videoUrl, index) => (
        //     <video key={index} src={videoUrl} autoPlay={true} muted={true} loop={true} />
        // ))
    )
}

export default Test;