import React, { Component } from 'react';
import Navbar from './components/layout/navbar';
import Home from './components/home/home';
import { BrowserRouter, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import ResetPasswordComponent from './components/signing/password/resetPasswordComponent';
import axios from 'axios';
import { SERVER } from './config';
import { connect } from 'react-redux';
import { storeUser } from './store/actions/authActions';
import Playground from './components/layout/playground';

class App extends Component {

  state = {
    loaded: false
  }

  componentWillMount = () => {
    axios.get(SERVER + '/signin')
      .then(res => {
        const { status, user } = res.data;
        status && this.props.storeUser(user);
        this.setState({ loaded: true });
      }).catch(err => {
        console.log(err);
      });
  }

  render() {
    return this.state.loaded && (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Container>
            <Route exact path="/" component={Home} />
            <Route exact path="/playground" component={Playground} />
            <Route exact path="/reset_pw" component={ResetPasswordComponent} />
          </Container>
        </div>
      </BrowserRouter>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    storeUser: user => dispatch(storeUser(user))
  }
}

export default connect(null, mapDispatchToProps)(App);
