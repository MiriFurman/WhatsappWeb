import 'babel-polyfill';
import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import {wixAxiosConfig} from 'wix-axios-config';
import App from './components/App';
import {Provider} from 'mobx-react';
import {configureStores} from './stores/configureStores';

const baseUrl = window.__BASEURL__;

wixAxiosConfig(axios, {baseURL: baseUrl});

ReactDOM.render(
  <Provider {...configureStores(axios)}>
    <App/>
  </Provider>,
  document.getElementById('root')
);
