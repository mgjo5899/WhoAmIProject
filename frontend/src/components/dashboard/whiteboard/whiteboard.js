import React from 'react';

const WhiteBoard = ({ images, defaultWidth, height }) => {
    return (
        <div id="spread-sheet" className="card p-2 mt-3" style={{ defaultWidth, height }}>
            {images}
        </div>
    );
}

export default WhiteBoard;