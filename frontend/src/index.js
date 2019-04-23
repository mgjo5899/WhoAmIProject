import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './store/reducers/root_reducer';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import axios from 'axios';

axios.defaults.withCredentials = true;
const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));