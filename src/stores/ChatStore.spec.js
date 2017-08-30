import {expect} from 'chai';
import ChatStore, {RELATION_STATE} from './ChatStore';
import RestClient from '../common/restClient';
import {beforeAndAfter} from '../../test/environment';
import {baseURL} from '../../test/test-common';
import axios from 'axios';
import nock from 'nock';
import * as endpoints from '../common/endpoints';
import mobx from 'mobx';

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
    expect(store.conversations.toJS()).to.eql([]);
    expect(store.activeRelationId).to.equal(null);
    expect(store.activeRelationConversation).to.eql({});
    expect(store.relationState).to.equal('');
  });

  it('should store correct username and isLoggedIn values', async () => {
    const exampleUser = {id: '1a2b', name: username1};
    nock(baseURL).post(endpoints.LOGIN, {username: username1}).reply(200, exampleUser);
    nock(baseURL).get(`${endpoints.GET_RELATIONS}?userId=${exampleUser.id}`).reply(200, []);
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

  it('should store user relations', async () => {
    const conversations = ['a'];
    const contacts = ['b'];
    const userId = 'userId';
    nock(baseURL).get(`${endpoints.GET_RELATIONS}?userId=${userId}`)
      .reply(200, {conversations, contacts});
    await store.getRelations(userId);
    expect(store.contacts.toJS()).to.eql(contacts);
    expect(store.conversations.toJS()).to.eql(conversations);
  });

  it('should store fetched messages in store.activeRelationMessages', async () => {
    const generatedResponse = {
      id: '39d2a309-4430-4850-883a-0e22a03ad06d',
      members: ['a65bd338-aba1-42e9-ae2b-322b090e069e',
        'a98fb470-f2ec-45fd-b56c-1fecca7bda92'],
      messages: [{
        id: 'd0cca645-d462-477e-8c1b-9a39226cf408',
        body: 'Bend the knee',
        conversationId: '39d2a309-4430-4850-883a-0e22a03ad06d',
        created: '2017-08-29T13:47:37.295Z',
        createdBy: 'a65bd338-aba1-42e9-ae2b-322b090e069e'
      }]
    };
    const {id} = generatedResponse;
    nock(baseURL).get(`${endpoints.GET_CONVERSATION_BY_ID}?conversationId=${id}`)
      .reply(200, generatedResponse);
    await store.getConversationById(id);
    expect(mobx.toJS(store.activeRelationConversation)).to.eql(generatedResponse);
  });

  it('should store relation state to contact state', async () => {
    const relationId = 'd0cca645-d462-477e-8c1b-9a39226cf408';
    store.startConversation(relationId);
    expect(store.relationState).to.equal(RELATION_STATE.CONTACT);
  });

  it('should store relation state to conversation state', async () => {
    const relationId = 'd0cca645-d462-477e-8c1b-9a39226cf408';
    nock(baseURL).get(`${endpoints.GET_CONVERSATION_BY_ID}?conversationId=${relationId}`)
      .reply(200, {});
    store.startConversation(relationId, false);
    expect(store.relationState).to.equal(RELATION_STATE.CONVERSATION);
  });
});
