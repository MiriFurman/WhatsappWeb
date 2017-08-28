import {expect} from 'chai';
import axios from 'axios';
import {beforeAndAfter, app} from '../environment';
import {baseURL} from '../test-common';
import {wixAxiosInstanceConfig} from 'wix-axios-config';

const axiosInstance = wixAxiosInstanceConfig(axios, {
  baseURL,
  adapter: require('axios/lib/adapters/http'),
});

import RestClient from '../../src/common/restClient';

describe('Chat App Server', () => {
  beforeAndAfter();

  const restClient = new RestClient(axiosInstance, url => app.getUrl(url));

  const user1 = 'Danny';
  const user2 = 'Jon';

  beforeEach(() => {
    return axiosInstance.post(app.getUrl('/api/flush'));
  });

  it('should login', async () => {
    const url = app.getUrl('/api/login');
    const response = await axiosInstance.post(url, {username: user1});
    expect(response.status).to.equal(200);
  });

  it('should get empty contacts list on login', async () => {
    const url = app.getUrl('/api/contacts');
    const response = await axiosInstance.get(url);
    expect(response.data).to.eql([]);
  });

  it('should get contacts list when there are 2 users', async () => {
    const url = app.getUrl('/api/login');
    let response = await axiosInstance.post(url, {username: user1});
    expect(response.status).to.equal(200);
    response = await axiosInstance.post(url, {username: user2});
    expect(response.status).to.equal(200);
    const contacts = await restClient.getContacts();
    expect(contacts.map(x => x.name)).to.eql([user1, user2]);
  });
});
