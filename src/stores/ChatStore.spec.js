import {expect} from 'chai';
import ChatStore from './ChatStore';
import RestClient from '../common/restClient';
import {beforeAndAfter} from '../../test/environment';
import {baseURL} from '../../test/test-common';
import axios from 'axios';
import nock from 'nock';
import * as endpoints from '../common/endpoints';

const restClient = new RestClient(axios, url => `${baseURL}${url}`);

describe('Chat Store unit tests', () => {
  beforeAndAfter();

  let store;
  const username1 = 'Peter';

  beforeEach(() => {
    store = new ChatStore(restClient);
  });

  it('should have the initial state', () => {
    expect(store.username).to.equal('');
    expect(store.currentUser).to.eql({});
    expect(store.isLoggedIn).to.equal(false);
    expect(store.contacts.toJS()).to.eql([]);
    expect(store.activeRelationId).to.equal(null);
  });

  it('should store correct username and isLoggedIn values', async () => {
    const exampleUser = {id: '1a2b', name: username1};
    nock(baseURL).post(endpoints.LOGIN, {username: username1}).reply(200, exampleUser);
    nock(baseURL).get(endpoints.CONTACTS).reply(200, []);
    await store.login(username1);
    expect(store.currentUser).to.eql(exampleUser);
    expect(store.isLoggedIn).to.equal(true);
  });

  it('should store contact list', async () => {
    nock(baseURL).get(endpoints.CONTACTS).reply(200, [username1]);
    await store.getContacts();
    expect(store.contacts.toJS()).to.eql([username1]);
  });

  it('should store active relation', () => {
    store.startConversation('777');
    expect(store.activeRelationId).to.equal('777');
  });
});
