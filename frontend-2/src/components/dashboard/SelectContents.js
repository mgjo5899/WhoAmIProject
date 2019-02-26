import React, { Fragment } from 'react';
import Contents from './Contents';


const SelectContents = props => {
    return (
        <Fragment>
            <div className="d-flex justify-content-center m-2">
                {props.element && <img src={props.element.src} alt={props.element.name} className="w-25 h-25" />}
            </div>
            <hr />
            <h5 className="d-flex justify-content-center m-2">Select the image</h5>
            <hr />
            <Contents {...props} />
        </Fragment>
    );
}

export default SelectContents;
