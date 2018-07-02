import React, { Component } from 'react';
import Instagram from './components/Instagram';
import { HashRouter, Route } from 'react-router-dom';

import axios from 'axios'

class APITest extends Component {

  componentWillMount() {


  }

  render() {
    return (
      <div>
       	<div className="row">
       		<div className="col-md-4 col-md-offset-4">
       			<Instagram />
       		</div>
       	</div>
      </div>
    );
  }
}

export default APITest;
