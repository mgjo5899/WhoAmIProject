import React, { Fragment } from 'react';
import { Button, NavItem, UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import { connect } from 'react-redux';
import { signOut } from '../../store/actions/authActions';
import ChangePassword from './password/changePassword';

const SignOut = ({ auth, signOut }) => {

    const handleLogOut = e => {
        signOut();
    }

    return (
        <Fragment>
            <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                    {auth.user.username}
                </DropdownToggle>
                <DropdownMenu right>
                    <ChangePassword />
                    <DropdownItem>
                        Not Yet
                        </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>
                        Not Yet
                        </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem>
                <Button color="dark" onClick={handleLogOut}>Sign out</Button>
            </NavItem>
        </Fragment >
    );
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = dispatch => {
    return {
        signOut: () => dispatch(signOut())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignOut);