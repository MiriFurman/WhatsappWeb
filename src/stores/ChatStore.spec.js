import {expect} from 'chai';
import ChatStore, {RELATION_STATE} from './ChatStore';
import RestClient from '../common/restClient';
import {beforeAndAfter} from '../../test/environment';
import {baseURL} from '../../test/test-common';
import axios from 'axios';
import nock from 'nock';
import * as endpoints from '../common/endpoints';
import * as mobx from 'mobx';

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
    expect(store.authenticationProblem).to.equal(false);
    expect(store.filteredValue).to.equal('');
    expect(store.createGroupMode).to.equal(false);
    expect(store.groupMembers.toJS()).to.eql([]);
    expect(store.groupTags.toJS()).to.eql([]);
  });

  it('should store correct username and isLoggedIn values', async () => {
    const user = {
      username: username1,
      password: '1q2w3e'
    };
    const exampleUser = {id: '1a2b', name: username1};
    nock(baseURL).post(endpoints.LOGIN, {user}).reply(200, exampleUser);
    nock(baseURL).get(`${endpoints.GET_RELATIONS}?userId=${exampleUser.id}`).reply(200, []);
    await store.login(user);
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

  it('should display only contacts without conversation', async () => {
    const contactsWithConversation = ['0ecc3b62-7059-4086-b273-91610aca4c31', 'f1c5fc86-170c-48a0-a1e0-a2121f936e20'];
    const currentUserId = 'e10f1e42-78e6-4931-8d0a-01bca3cd5046';
    const contactWithoutConversation = 'c71b811e-8c7f-44e3-a376-8ea75b2c6ea8';
    const conversations = [{
      id: '03c293b1-6a8e-466f-bfa3-eff133ba63d7',
      members: [currentUserId, contactsWithConversation[0]]
    },
      {
        id: 'c568a24a-6678-4c8e-9db7-3e305ebf4e71',
        members: [contactsWithConversation[1], currentUserId]
      }
    ];
    const contacts = [{id: contactWithoutConversation}, {id: contactsWithConversation[0]}, {id: contactsWithConversation[1]}];
    const relations = {conversations, contacts};
    nock(baseURL).get(`${endpoints.GET_RELATIONS}?userId=${currentUserId}`).reply(200, relations);
    store.currentUser = {id: currentUserId};
    await store.getRelations(currentUserId);
    expect(mobx.toJS(store.displayContacts[0]).id).to.equal(contactWithoutConversation);
  });

  it('should remove current conversation when clicking on contact', async () => {
    const relationId = '0ecc3b62-7059-4086-b273-91610aca4c31';
    const activeRelationConversation = {
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
    store.activeRelationConversation = activeRelationConversation;
    store.startConversation(relationId);
    expect(mobx.toJS(store.activeRelationConversation)).to.eql({});
  });


  it('should return the correct conversation display name', async () => {
    store.activeRelationConversation = {
      id: '03c293b1-6a8e-466f-bfa3-eff133ba63d7'
    };
    store.conversations = [
      {
        id: '03c293b1-6a8e-466f-bfa3-eff133ba63d7',
        displayName: 'correct'
      },
      {
        id: 'c568a24a-6678-4c8e-9db7-3e305ebf4e71',
        displayName: 'incorrect'
      }
    ];
    expect(store.conversationDisplayName).to.equal('correct');
  });

  it('should change create group mode on request', () => {
    store.showCreateGroup();
    expect(store.createGroupMode).to.equal(true);
    store.hideCreateGroup();
    expect(store.createGroupMode).to.equal(false);
  });

  it('should display only contacts that are not members of group when creating group', async () => {
    const members = ['0ecc3b62-7059-4086-b273-91610aca4c31', 'f1c5fc86-170c-48a0-a1e0-a2121f936e20'];
    const currentUserId = 'e10f1e42-78e6-4931-8d0a-01bca3cd5046';
    const contacts = 'c71b811e-8c7f-44e3-a376-8ea75b2c6ea8';
    store.contacts = [{id: contacts}, {id: members[0]}, {id: members[1]}];
    store.groupMembers = members;
    store.currentUser = {id: currentUserId};
    expect(mobx.toJS(store.groupDisplayContacts[0]).id).to.equal(contacts);
  });
  it('should set authentication problem as true', async () => {
    const user = {
      username: username1,
      password: '1q2w3e'
    };
    nock(baseURL).post(endpoints.LOGIN, {user}).reply(200, null);
    await store.login(user);
    expect(store.authenticationProblem).to.equal(true);
  });
});
