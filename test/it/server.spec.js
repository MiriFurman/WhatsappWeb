import {expect} from 'chai';
import axios from 'axios';
import {beforeAndAfter, app} from '../environment';
import {baseURL} from '../test-common';
import {wixAxiosInstanceConfig} from 'wix-axios-config';
import {FLUSH} from '../../src/common/endpoints';

const axiosInstance = wixAxiosInstanceConfig(axios, {
  baseURL,
  adapter: require('axios/lib/adapters/http'),
});

import RestClient from '../../src/common/restClient';

describe('Chat App Server', () => {
  beforeAndAfter();

  const restClient = new RestClient(axiosInstance, url => app.getUrl(url));

  const user1 = {username: 'Danny', password: '123'};
  const user2 = {username: 'Jon', password: 'xcv'};
  const user3 = {username: 'Cersei', password: '113'};

  beforeEach(async () => {
    await axiosInstance.post(app.getUrl(FLUSH));
    await restClient.signup(user1);
    await restClient.signup(user2);
  });

  it('should login', async () => {
    const userObj = await restClient.login({username: user1.username, password: user1.password});
    expect(userObj.name).to.equal(user1.username);
  });

  it('should get contacts list when there are 2 users', async () => {
    await restClient.login(user1);
    await restClient.login(user2);
    const contacts = await restClient.getContacts();
    expect(contacts.map(x => x.name)).to.eql([user1, user2].map(x => x.username));
  });

  it('should create conversation on first message', async () => {
    const user1Obj = await restClient.login(user1);
    const user2Obj = await restClient.login(user2);
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

  it('should get messages from conversation by its conversation id', async () => {
    const user1Obj = await restClient.login(user1);
    const user2Obj = await restClient.login(user2);
    const exampleMessage = 'Bend the knee';
    const conversationId = await restClient
      .sendMessage(user1Obj.id, [user1Obj.id, user2Obj.id], exampleMessage);
    const receivedConversation = await restClient.getConversationById(conversationId);
    expect(receivedConversation.messages[0].body).to.equal(exampleMessage);
  });

  it('should send and receive multiple messages', async () => {
    const user1Obj = await restClient.login(user1);
    const user2Obj = await restClient.login(user2);
    const exampleMessage1 = 'Bend the knee';
    const exampleMessage2 = 'You are my queen!';
    const exampleMessage3 = 'Do you like dragons?';
    const conversationId1 = await restClient
      .sendMessage(user1Obj.id, [user1Obj.id, user2Obj.id], exampleMessage1);
    const conversationId2 = await restClient
      .sendMessage(user2Obj.id, [user2Obj.id, user1Obj.id], exampleMessage2);
    const conversationId3 = await restClient
      .sendMessage(user1Obj.id, [user1Obj.id, user2Obj.id], exampleMessage3);
    expect(conversationId1).to.equal(conversationId2);
    expect(conversationId1).to.equal(conversationId3);
    const receivedConversation = await restClient.getConversationById(conversationId1);
    expect(receivedConversation.messages.map(msg => msg.body)).to.eql([exampleMessage1, exampleMessage2, exampleMessage3]);
  });
  it('should reject login with wrong credentials', async () => {
    const signupUser = {
      username: 'Shimon',
      password: '1q2w3e'
    };
    await restClient.signup(signupUser);
    const userObj = await restClient.login({username: signupUser.username, password: 'WRONG_PASS'});
    expect(userObj).to.eql(null);
  });
  it('should authenticate successfully', async () => {
    const signupUser = {
      username: 'Shimon',
      password: '1q2w3e'
    };
    await restClient.signup(signupUser);
    const userObj = await restClient.login({
      username: signupUser.username,
      password: signupUser.password
    });
    expect(userObj.name).to.eql(signupUser.username);
  });

  it('should create group conversation with display name', async () => {
    await restClient.signup(user3);
    const user1Obj = await restClient.login(user1);
    const user2Obj = await restClient.login(user2);
    const user3Obj = await restClient.login(user3);
    const displayName = 'White walkers are bad!!!';
    const msg1 = 'The Lanisters always pay their debts';
    const msg2 = 'I know nothing';
    const members = [user1Obj.id, user2Obj.id, user3Obj.id];
    const groupId = await restClient.createGroup(members, displayName);
    const conversationId1 = await restClient.sendMessage(user3Obj.id, members, msg1);
    const conversationId2 = await restClient.sendMessage(user1Obj.id, members, msg2);
    expect(conversationId1).to.equal(groupId);
    expect(conversationId1).to.equal(conversationId2);
    const receivedConversation = await restClient.getConversationById(conversationId1);
    expect(receivedConversation.displayName).to.equal(displayName);
  });
  it('should get last message on conversation object', async () => {
    const user1Obj = await restClient.login(user1);
    const user2Obj = await restClient.login(user2);
    const exampleMessage = 'Bend the knee';
    await restClient.sendMessage(user1Obj.id, [user1Obj.id, user2Obj.id], exampleMessage);
    const relations = await restClient.getRelations(user1Obj.id);
    expect(relations.conversations[0]).to.have.all.keys('id', 'displayName', 'members', 'lastMessage', 'unreadMessageCount');
    expect(relations.conversations[0].lastMessage).to.have.all.keys('created', 'body');
  });
  it('should ack conversation', async () => {
    const user1Obj = await restClient.login(user1);
    const user2Obj = await restClient.login(user2);
    const exampleMessage = 'Bend the knee';
    const conversationId = await restClient.sendMessage(user1Obj.id, [user1Obj.id, user2Obj.id], exampleMessage);
    const {conversations} = await restClient.getRelations(user2Obj.id);
    expect(conversations[0].unreadMessageCount).to.equal(1);
    await restClient.ackConversation({conversationId, contactId: user2Obj.id});
    const relationAfterAck = await restClient.getRelations(user2Obj.id);
    expect(relationAfterAck.conversations[0].unreadMessageCount).to.equal(0);
  });
});
