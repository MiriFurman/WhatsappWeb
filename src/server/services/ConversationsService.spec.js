import {expect} from 'chai';
import {conversationsService} from './ConversationsService';
import {contactsService} from './ContactsService';

describe('Conversations Service', () => {
  let messageBody, members;
  let user1, user2;

  beforeEach(() => {
    conversationsService.reset();
    contactsService.reset();

    user1 = contactsService.create({name: 'Bob'});
    user2 = contactsService.create({name: 'Marley'});
    messageBody = 'Hello world!';
    members = [user1.id, user2.id];
  });

  it('should create a new conversation', () => {
    const conversationId = conversationsService.addMessage({from: members[0], messageBody, members});
    expect(conversationId).to.be.a('string');
  });

  it('should get conversation messages by conversation id', () => {
    const conversationId = conversationsService.addMessage({from: members[0], messageBody, members});
    const conversation = conversationsService.getMessagesById(conversationId);

    expect(conversation.id).to.equal(conversationId);
    expect(conversation.members).to.eql(members);
    expect(conversation.messages[0].body).to.equal(messageBody);
    expect(conversation.messages[0].createdBy).to.equal(members[0]);
  });

  it('should fail to get conversation messages by id when conversation does not exist', () => {
    let thrown = false;
    try {
      conversationsService.getMessagesById('1234');
    } catch (e) {
      thrown = e.message;
    }

    expect(thrown).to.contain('Conversation not found');
  });

  it('should reset conversations', () => {
    let thrown = false;
    const conversationId = conversationsService.addMessage({from: members[0], messageBody, members});
    conversationsService.reset();
    try {
      conversationsService.getMessagesById(conversationId);
    } catch (e) {
      thrown = e.message;
    }

    expect(thrown).to.contain('Conversation not found');
  });

  it('shoud add a message to an existing conversation', () => {
    const messageBody2 = 'Hello Kickstart!';
    conversationsService.addMessage({from: members[0], messageBody, members});
    const conversationId = conversationsService.addMessage({from: members[1], messageBody: messageBody2, members});

    const conversation = conversationsService.getMessagesById(conversationId);
    expect(conversation.messages.length).to.equal(2);
    expect(conversation.messages[0].body).to.equal(messageBody);
    expect(conversation.messages[1].body).to.equal(messageBody2);
  });

  it('should list empty conversations by contact id', () => {
    const conversationsList = conversationsService.listConversationsByContactId(user1.id);
    expect(conversationsList).to.eql([]);
  });

  it('should list conversations by contact id', () => {
    const conversationId = conversationsService.addMessage({from: members[0], messageBody, members});
    const conversationsList = conversationsService.listConversationsByContactId(members[0]);

    expect(conversationsList.length).to.eql(1);
    expect(conversationsList[0].id).to.equal(conversationId);
    expect(conversationsList[0].members).to.eql(members);
    expect(conversationsList[0].displayName).to.eql(user2.name);
  });

  it('should create group conversation including display name', () => {
    const displayName = 'The wall';
    const members = ['1', '2', '3'];
    const conversationId = conversationsService.createGroup({members, displayName});
    const conversationsList = conversationsService.listConversationsByContactId('1');
    expect(conversationsList[0].id).to.equal(conversationId);
    expect(conversationsList[0].displayName).to.equal(displayName);
  });

  it('should create group conversation with messages', () => {
    const displayName = 'The wall';
    const members = ['1', '2', '3'];
    const messageBody1 = 'Winter is coming!';
    const messageBody2 = 'oh no!';
    const conversationIdCreate = conversationsService.createGroup({members, displayName});
    const conversationIdMsg1 = conversationsService.addMessage({from: members[0], messageBody: messageBody1, members});
    const conversationIdMsg2 = conversationsService.addMessage({from: members[1], messageBody: messageBody2, members});
    expect(conversationIdCreate).to.equal(conversationIdMsg1);
    expect(conversationIdMsg2).to.equal(conversationIdMsg1);
    const conversationsList = conversationsService.listConversationsByContactId(members[2]);
    expect(conversationsList[0].displayName).to.equal(displayName);
    const {messages} = conversationsService.getMessagesById(conversationIdCreate);
    expect(messages[0].body).to.equal(messageBody1);
    expect(messages[0].createdBy).to.equal(members[0]);
  });
});
