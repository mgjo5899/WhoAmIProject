import React, { useState } from 'react';

const Image = ({ elem, id, setImageSelected }) => {

    const [selected, setSelected] = useState(false);

    const handleSelected = () => {
        selected
            ?
            setImageSelected(imageSelected => imageSelected.filter(image => image.id !== id))
            :
            setImageSelected(imageSelected => [...imageSelected, { id, elem }]);
        setSelected(selected => !selected);
    }

    return (
        <div className={"card" + (selected ? ' border border-primary' : '')} onClick={handleSelected}>
            {elem}
        </div >
    );
}

export default Image;