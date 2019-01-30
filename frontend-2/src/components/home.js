import React, { Component, Fragment } from 'react'
import SignUp from './signing/signup';

class Home extends Component {
    render() {
        return (
            <Fragment>
                <div className="pl-5 w-50 float-right">
                    <SignUp />
                </div>
                <div>
                    <h1 className="cover-heading">Cover your page.</h1>
                    <p className="lead">Cover is a one-page template for building simple and beautiful home pages. Download, edit the text, and add your own fullscreen background photo to make it your own.</p>
                </div>
            </Fragment>
        );
    }
}

export default Home;