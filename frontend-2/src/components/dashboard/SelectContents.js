import React, { Fragment } from 'react';
import Contents from './Contents';


const SelectContents = ({ nextToSpreadSheet, previous, element }) => {
    return (
        <Fragment>
            <div className="d-flex justify-content-center m-2">
                {element && <img src={element.src} alt={element.name} className="w-25 h-25" />}
            </div>
            <hr />
            <h5 className="d-flex justify-content-center m-2">Select the image</h5>
            <hr />
            <Contents nextToSpreadSheet={nextToSpreadSheet} previous={previous} />
        </Fragment>
    );
}

export default SelectContents;
