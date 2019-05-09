import React, { Component } from 'react';
import Home from './components/home/home';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import { SERVER } from './config';
import { connect } from 'react-redux';
import { storeUser } from './store/actions/auth_actions';
import OAuthRedirect from './components/social-media/o_auth_redirect';
import ErrorPage from './components/error/error_page';
import ResetPasswordComponent from './components/signing/password/reset_password_component';
import MainPage from './components/home/main_page';
import Profile from './components/profile/profile';
import { Drag } from './components/dashboard/drag_and_drop';
import { setChanged } from './store/actions/change_actions';

class App extends Component {

  state = {
    loaded: false
  }

  componentDidMount = () => {
    axios.get(SERVER + '/signin')
      .then(res => {
        const { status, user } = res.data;
        status && this.props.storeUser(user);
        this.setState({ loaded: true });
      }).catch(err => {
        console.log(err);
      });
    Drag(this.props.setChanged);
  }

  render() {
    return this.state.loaded && (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path="/oauth_redirect" component={OAuthRedirect} />
            <Route exact path="/error_page" component={ErrorPage} />
            <Route exact path="/" component={Home} />
            <Route exact path="/reset_pw" component={ResetPasswordComponent} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/:username" component={MainPage} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    storeUser: user => dispatch(storeUser(user)),
    setChanged: changed => dispatch(setChanged(changed))
  }
}

export default connect(null, mapDispatchToProps)(App);
