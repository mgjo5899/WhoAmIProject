import React, { Component } from 'react';
import Navbar from './components/layout/navbar';
import Home from './components/home/home';
import { BrowserRouter, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import ResetPasswordComponent from './components/signing/password/resetPasswordComponent';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Container>
            <Route exact path="/" component={Home} />
            <Route exact path="/reset_pw" component={ResetPasswordComponent} />
          </Container>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
