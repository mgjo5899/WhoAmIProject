import React from 'react';
import { Button, NavItem } from 'reactstrap';
import axios from 'axios';

const SignOut = () => {

    const handleLogOut = e => {
        axios.defaults.withCredentials = false;
        // console.log(document.cookie);
        window.location.reload()
    }

    return (
        <NavItem>
            <Button color="dark" onClick={handleLogOut}>Sign Out</Button>
        </NavItem>
    );
}

export default SignOut;