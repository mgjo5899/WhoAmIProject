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
import { createStore } from 'redux';
import reducers from './reducers';
import { Provider } from 'react-redux';


console.log('init state', store.getState());
store.subscribe(()=>console.log(store.getState()));
store.dispatch(actions.doLogin('yjyj', '1234'));
store.dispatch(actions.doLogout());


ReactDOM.render(
    // Instead of passing store as a props into the App component,
    // We use react-redux Provider (view-binding tool)
    <Provider store={ store }>
        <App />
    </Provider>, 
    document.getElementById('root')
);

registerServiceWorker();
