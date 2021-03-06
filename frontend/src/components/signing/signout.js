import React, { Fragment } from 'react';
import { Button, NavItem, UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import { connect } from 'react-redux';
import { signOut } from '../../store/actions/auth_actions';
import { withRouter } from 'react-router-dom';

const SignOut = ({ auth, signOut, history }) => {

    return (
        <Fragment>
            <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                    {auth.user.username}
                </DropdownToggle>
                <DropdownMenu right>
                    <DropdownItem onClick={() => history.push('/setting')}>
                        Setting
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem>
                <Button color="dark" onClick={() => signOut(history)}>Sign out</Button>
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
        signOut: history => dispatch(signOut(history))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignOut));