import React from 'react';

const WhiteBoard = ({ images, DEFAULT_WIDTH, height }) => {
    return (
        <div id="spread-sheet" className="card p-2 mt-3 w-100" style={{ minWidth: 1100, height }}>
            {images}
        </div>

    );
}

export default WhiteBoard;