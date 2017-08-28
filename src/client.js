import 'babel-polyfill';
import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import {wixAxiosConfig} from 'wix-axios-config';
import App from './components/App';
import RestClient from './common/restClient';

const baseUrl = window.__BASEURL__;
// was for translation; possible to delete later
// const locale = window.__LOCALE__;
// const staticsBaseUrl = window.__STATICS_BASE_URL__;

wixAxiosConfig(axios, {baseURL: baseUrl});

const restClient = new RestClient(axios);

ReactDOM.render(
  <App restClient={restClient}/>,
  document.getElementById('root')
);
