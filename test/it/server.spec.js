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
    const userObj = await restClient.login(user1);
    expect(userObj.name).to.equal(user1);
  });

  it('should get empty contacts list on login', async () => {
    const contacts = await restClient.getContacts();
    expect(contacts).to.eql([]);
  });

  it('should get contacts list when there are 2 users', async () => {
    await restClient.login(user1);
    await restClient.login(user2);
    const contacts = await restClient.getContacts();
    expect(contacts.map(x => x.name)).to.eql([user1, user2]);
  });

  it('should create conversation on first message', async () => {
    const user1Obj = await restClient.login(user1);
    const user2Obj = await restClient.login(user2);
    //setup above
    const exampleMessage = 'Bend the knee';
    const conversationId = await restClient
      .sendMessage(user1Obj.id, [user1Obj.id, user2Obj.id], exampleMessage);
    expect(conversationId).to.be.a.string;
  });

  it('should get relations from server', async () => {
    const user1Obj = await restClient.login(user1);
    const user2Obj = await restClient.login(user2);
    const exampleMessage = 'Bend the knee';
    const conversationId = await restClient
      .sendMessage(user1Obj.id, [user1Obj.id, user2Obj.id], exampleMessage);

    const relations = await restClient.getRelations(user1Obj.id);
    expect(relations.conversations[0].id).to.equal(conversationId);
    expect(relations.contacts.length).to.equal(2);
  });

});
