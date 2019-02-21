import React, { useState } from 'react';

const Image = ({ elem }) => {

    const [selected, setSelected] = useState(false);

    return (
        <div className={"card" + (selected ? ' border border-primary' : '')} onClick={() => setSelected(selected => !selected)}>
            {elem}
        </div >
    );
}

export default Image;