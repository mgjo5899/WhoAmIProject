import React, { Fragment } from 'react';
import Contents from './Contents';


const SelectContents = ({ next, previous, element }) => {
    return (
        <Fragment>
            <div className="d-flex justify-content-center m-5">
                {element && <img src={element.src} alt={element.name} className="w-25 h-25" />}
            </div>
            <Contents previous={previous} />
        </Fragment>
    );
}

export default SelectContents;
