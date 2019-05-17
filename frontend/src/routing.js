import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import OAuthRedirect from './components/social-media/o_auth_redirect';
import ErrorPage from './components/error/error_page';
import ResetPasswordComponent from './components/signing/password/reset_password_component';
import MainPage from './components/home/main_page';
import Profile from './components/profile/profile';
import Home from './components/home/home';
import Follow from './components/follow/follow';
import Setting from './components/setting/setting';

const Routing = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/oauth_redirect" component={OAuthRedirect} />
                <Route exact path="/error_page" component={ErrorPage} />
                <Route exact path="/" component={Home} />
                <Route exact path="/setting" component={Setting} />
                <Route exact path="/reset_pw" component={ResetPasswordComponent} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/follow" component={Follow} />
                <Route exact path="/:username" component={MainPage} />
            </Switch>
        </BrowserRouter>
    );
}

export default Routing;