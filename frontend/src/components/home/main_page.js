import React, { useState, Fragment } from 'react';
import { Carousel, CarouselItem } from 'reactstrap';
import { Dashboard, ConnectTo, Contents, Spread } from '../dashboard';
import Navbar from '../layout/navbar';
import { connect } from 'react-redux';
import { resetData, setData, showImages, updateData, deleteData } from '../../store/actions/data_actions';
import { next, previous } from '../../store/actions/carousel_actions';

const MainPage = ({ match, resetData, data, setData, next, previous, activeIndex, history }) => {

    // this component contains many children components, which requires multiple states to use
    const [element, setElement] = useState(null);
    const [contents, setContents] = useState([]);

    const contentsIndex = {
        dashboard: 0,
        connect_to: 1,
        contents: 2,
        spread: 3
    }
    const deleteImage = img => {
        // handle the case when it is not previously selected medium
        const selectedMedium = img.isSelected !== undefined;
        if (selectedMedium) img.isSelected = !img.isSelected;
        // everything based on src
        // find existing index
        const existingIndex = data.existing.findIndex(elem => elem.id === img.id) !== -1;
        if (!selectedMedium) {
            // if the image is not from the selected medium, and if the user clicks delete button, then add the image to delete data
            setData({ delete: [...data.delete, img] });
        } else if (img.isSelected) {
            // selected
            // check if it is in existing one, if it is, then erase from delete, if it is not, then add the object to add state
            if (existingIndex) {
                setData({ delete: data.delete.filter(elem => elem.id !== img.id) });
            } else {
                setData({ new: [...data.new, img] });
            }
        } else {
            // unselect
            // check existing one, if it exists, then add into delete, if it is not, then erase from add
            if (existingIndex) {
                setData({ delete: [...data.delete, img] });
            } else {
                setData({ new: data.new.filter(elem => elem.id !== img.id) });
            }
        }
        // update to data and contents
        setData({ selected: contents.filter(content => content.isSelected) });
        setContents(contents);
    }

    // basic props to inherit
    const props = {
        next,
        previous,
        activeIndex,
        contentsIndex,
        data,
        setData
    };

    // list of components to use programmatically
    const items = [
        <Dashboard
            {...{
                ...props,
                resetData,
                username: match.params.username,
                showImages,
                updateData,
                deleteData
            }}
        />,
        <ConnectTo {...props} setElement={setElement} />,
        <Contents
            {...props}
            element={element}
            contents={contents}
            setContents={setContents}
            deleteImage={deleteImage}
        />,
        <Spread
            {...{
                ...props,
                deleteImage,
                element,
                showImages,
                setData,
                flag: 1,
                next: () => history.push('/'),
                updateData,
                deleteData
            }}
        />
    ];

    const slides = items.map((item, index) => (
        <CarouselItem key={index}>
            {item}
        </CarouselItem>
    ));

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
    data: state.data,
    activeIndex: state.carousel.dashboardActiveIndex
})

const mapDispatchToProps = dispatch => ({
    resetData: () => dispatch(resetData()),
    setData: data => dispatch(setData(data)),
    next: () => dispatch(next('DASHBOARD')),
    previous: () => dispatch(previous('DASHBOARD'))
})

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);