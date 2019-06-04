import React, { Fragment } from 'react';
import queryString from 'query-string';

const OAuthRedirect = props => {
    const parsed = queryString.parse(props.location.search);
    const { status } = parsed;
    if (status === 'true') {
        try {
            window.opener.checkAuthorizedSocialMedia();
            window.close();
        } catch (error) {
            console.log(error);
            props.history.push('/');
        }
    } else if (status === 'false') {
        console.log('err');
    }
    return (<Fragment></Fragment>);
}
export default OAuthRedirect;