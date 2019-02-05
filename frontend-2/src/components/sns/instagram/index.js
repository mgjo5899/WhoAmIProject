import React from 'react';
import { DropdownItem } from 'reactstrap';

const Instagram = ({ handleRegister }) => {

    return (
        <DropdownItem onClick={() => handleRegister}>
            Instagram
        </DropdownItem>
    );
}

export default Instagram;