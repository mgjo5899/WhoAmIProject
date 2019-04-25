import React, { Fragment } from 'react';
import queryString from 'query-string';

const ErrorPage = props => {
    const parsed = queryString.parse(props.location.search);
    return (
        <Fragment>
            <h1>Page not found</h1>
            <h3>{parsed.msg}</h3>
        </Fragment>
    );
}

export default ErrorPage;