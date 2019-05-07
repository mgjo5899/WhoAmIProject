import React from 'react';

const PlusButton = ({ isOwner, next }) => {
    return (
        isOwner && (
            <svg id="i-plus" onClick={next} className="m-2 text-dark bg-primary rounded-circle" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <path d="M16 2 L16 30 M2 16 L30 16" />
            </svg>
        )
    );
}

export default PlusButton;