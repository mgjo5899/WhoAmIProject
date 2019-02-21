import React, { Fragment, useState } from 'react';
import Image from './Image';

const images = [
    <div>
        <img className="card-img-top" src="..." alt="Card image cap" />
        <div className="card-body">
            <h5 className="card-title">Card title that wraps to a new line</h5>
            <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
        </div>
    </div>
    ,
    <blockquote className="blockquote mb-0 card-body">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
        <footer className="blockquote-footer">
            <small className="text-muted">
                Someone famous in <cite title="Source Title">Source Title</cite>
            </small>
        </footer>
    </blockquote>
    ,
    <div>
        <img className="card-img-top" src="..." alt="Card image cap" />
        <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <p className="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
            <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
        </div>
    </div>

    ,
    <blockquote className="blockquote mb-0">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat.</p>
        <footer className="blockquote-footer">
            <small>
                Someone famous in <cite title="Source Title">Source Title</cite>
            </small>
        </footer>
    </blockquote>
    ,
    <div className="card-body">
        <h5 className="card-title">Card title</h5>
        <p className="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
        <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
    </div>
    ,
    <img className="card-img" src="..." alt="Card image" />
    ,
    <blockquote className="blockquote mb-0">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
        <footer className="blockquote-footer">
            <small className="text-muted">
                Someone famous in <cite title="Source Title">Source Title</cite>
            </small>
        </footer>
    </blockquote>
    ,
    <div className="card-body">
        <h5 className="card-title">Card title</h5>
        <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
        <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
    </div>
];

const Contents = ({ nextToSpreadSheet, previous }) => {

    const [imageSelected, setImageSelected] = useState([]);

    const handleNext = () => {
        nextToSpreadSheet(imageSelected);
    }

    return (
        <Fragment>
            <div className="card-columns">
                {images.map((elem, index) => (
                    <Image key={index} elem={elem} id={index} setImageSelected={setImageSelected} />
                ))}
            </div >
            <div className="card-footer text-muted m-3 d-flex justify-content-center">
                <button className="btn btn-danger mx-auto" onClick={previous}>Cancel</button>
                <button className="btn btn-primary mx-auto" onClick={handleNext}>Done</button>
            </div>
        </Fragment>
    );
}

export default Contents;
