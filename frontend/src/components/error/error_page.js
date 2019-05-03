import React from 'react';
import { Link } from 'react-router-dom';
import "./css/style.css";

const ErrorPage = () => {

    document.title = 'Not Found 404';

    const style = {
        userSelect: 'none'
    };

    return (
        <div id="notfound">
            <div className="notfound">
                <div className="notfound-404">
                    <h1 style={style}>404</h1>
                </div>
                <h2 style={style}>Oops! This Page Could Not Be Found</h2>
                <p style={style}>Sorry but the page you are looking for does not exist, have been removed. name changed or is temporarily unavailable</p>
                <Link to="/" style={style}>Go To Homepage</Link>
            </div>
        </div>
    );
}

export default ErrorPage;