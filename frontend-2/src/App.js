import React, { Component } from 'react';
import Navbar from './components/layout/navbar';
import Home from './components/home';
import {BrowserRouter, Route} from 'react-router-dom';
import {Container} from 'reactstrap';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Container>
              <Route exact path="/" component={Home} />
          </Container>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
