import React from 'react';
import ReactDOM from 'react-dom';
import * as actions from './actions/auth';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


// React-Redux
// dispatch(action) : send action to reducer. 
// When dispatch gets run, store sends current state and action to reducer function

import store from "./store";
import { Provider } from 'react-redux';
import { Router, Route, Link } from 'react-router-dom';
import history from "./history";

console.log('init state', store.getState());
store.subscribe(()=>console.log(store.getState()));

ReactDOM.render(
    // Instead of passing store as a props into the App component,
    // We use react-redux Provider (view-binding tool)
    <Provider store={ store }>
        <Router history={ history }>
            <App />
        </Router>
    </Provider>, 
    document.getElementById('root')
);

registerServiceWorker();
