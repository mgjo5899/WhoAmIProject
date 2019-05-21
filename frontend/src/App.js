import React, { Component } from 'react';
import axios from 'axios';
import { SERVER } from './config';
import { connect } from 'react-redux';
import { storeUser } from './store/actions/auth_actions';
import Routing from './routing';
import { Drag } from './components/dashboard/drag_and_drop';
import { setChanged } from './store/actions/changed_actions';

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
      <div className="App">
        <Routing auth={this.props.auth} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => {
  return {
    storeUser: user => dispatch(storeUser(user)),
    setChanged: changed => dispatch(setChanged(changed))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
