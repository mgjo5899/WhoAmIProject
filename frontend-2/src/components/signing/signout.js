import React from 'react';
import { Button, NavItem } from 'reactstrap';
import { connect } from 'react-redux';
import { signOut } from '../../store/actions/authActions';

const SignOut = ({ signOut }) => {

    const handleLogOut = e => {
        signOut();
    }

    return (
        <NavItem>
            <Button color="dark" onClick={handleLogOut}>Sign out</Button>
        </NavItem>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        signOut: () => dispatch(signOut())
    }
}

export default connect(null, mapDispatchToProps)(SignOut);