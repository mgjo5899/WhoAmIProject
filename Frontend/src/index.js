import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


// React-Redux

import store from "./store";
import { createStore } from 'redux';
import reducers from './reducers';
import { Provider } from 'react-redux';


console.log('init state', store.getState());

ReactDOM.render(
    <Provider store={ store }>
        <App />
    </Provider>, 
    document.getElementById('root')
);

registerServiceWorker();
