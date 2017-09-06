import {expect} from 'chai';
import {conversationsService} from './ConversationsService';
import {contactsService} from './ContactsService';

describe('Conversations Service', () => {
  let messageBody, members;
  let user1, user2;

  beforeEach(() => {
    conversationsService.reset();
    contactsService.reset();

    user1 = contactsService.create({name: 'alice'});
    user2 = contactsService.create({name: 'michaels@wix.com'});
    messageBody = 'Hello world!';
    members = [user1.id, user2.id];
  });

  it('should create a new conversation', () => {
    const conversationId = conversationsService.addMessage({
      from: members[0],
      messageBody,
      members
    });
    expect(conversationId).to.be.a('string');
  });

  it('should get conversation messages by conversation id', () => {
    const conversationId = conversationsService.addMessage({
      from: members[0],
      messageBody,
      members
    });
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
    const conversationId = conversationsService.addMessage({
      from: members[0],
      messageBody,
      members
    });
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
    const conversationId = conversationsService.addMessage({
      from: members[1],
      messageBody: messageBody2,
      members
    });

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
    const conversationId = conversationsService.addMessage({
      from: members[0],
      messageBody,
      members
    });
    const conversationsList = conversationsService.listConversationsByContactId(members[0]);

    expect(conversationsList.length).to.eql(1);
    expect(conversationsList[0].id).to.equal(conversationId);
    expect(conversationsList[0].members).to.eql(members);
    expect(conversationsList[0].displayName).to.eql(user2.name);
  });

  it('should create group conversation including display name', () => {
    const displayName = 'The wall';
    const members = ['1', '2', '3'];
    const imgUrl = 'https://placeimg.com/60/60/nature';
    const conversationId = conversationsService.createGroup({members, displayName, imgUrl});
    const conversationsList = conversationsService.listConversationsByContactId('1');
    expect(conversationsList[0].id).to.equal(conversationId);
    expect(conversationsList[0].displayName).to.equal(displayName);
  });

  it('should create group conversation with messages', () => {
    const displayName = 'The wall';
    const members = ['1', '2', '3'];
    const messageBody1 = 'Winter is coming!';
    const messageBody2 = 'oh no!';
    const imgUrl = 'https://placeimg.com/60/60/nature';
    const conversationIdCreate = conversationsService.createGroup({members, displayName, imgUrl});
    const conversationIdMsg1 = conversationsService.addMessage({
      from: members[0],
      messageBody: messageBody1,
      members
    });
    const conversationIdMsg2 = conversationsService.addMessage({
      from: members[1],
      messageBody: messageBody2,
      members
    });
    expect(conversationIdCreate).to.equal(conversationIdMsg1);
    expect(conversationIdMsg2).to.equal(conversationIdMsg1);
    const conversationsList = conversationsService.listConversationsByContactId(members[2]);
    expect(conversationsList[0].displayName).to.equal(displayName);
    const {messages} = conversationsService.getMessagesById(conversationIdCreate);
    expect(messages[0].body).to.equal(messageBody1);
    expect(messages[0].createdBy).to.equal(members[0]);
  });

  it('should create new message with ack as empty array', () => {
    const contact1 = contactsService.create({name: 'shilo'});
    const contact2 = contactsService.create({name: 'maor'});
    const message = {
      from: contact1.id,
      members: [contact2.id, contact1.id],
      messageBody: 'Hi!'
    };
    conversationsService.addMessage(message);
    const conversationId = conversationsService.listConversationsByContactId(contact1.id)[0].id;
    expect(conversationsService.getMessagesById(conversationId).messages[0].ack).to.eql([contact1.id]);
  });

  it('should store userId upon acknowledgment', () => {
    const contact1 = contactsService.create({name: 'shilo'});
    const contact2 = contactsService.create({name: 'maor'});
    const message = {
      from: contact1.id,
      members: [contact2.id, contact1.id],
      messageBody: 'Hi!'
    };
    conversationsService.addMessage(message);
    const conversationId = conversationsService.listConversationsByContactId(contact1.id)[0].id;
    conversationsService.ack({conversationId, contactId: contact2.id});
    expect(conversationsService.getMessagesById(conversationId).messages[0].ack).to.eql([contact1.id, contact2.id]);
  });

  it('should prevent double acknowledgments', () => {
    const contact1 = contactsService.create({name: 'shilo'});
    const contact2 = contactsService.create({name: 'maor'});
    const message = {
      from: contact1.id,
      members: [contact2.id, contact1.id],
      messageBody: 'Hi!'
    };
    conversationsService.addMessage(message);
    const conversationId = conversationsService.listConversationsByContactId(contact1.id)[0].id;
    conversationsService.ack({conversationId, contactId: contact2.id});
    conversationsService.ack({conversationId, contactId: contact2.id});
    expect(conversationsService.getMessagesById(conversationId).messages[0].ack).to.eql([contact1.id, contact2.id]);
  });

  it('should get number of unread messaged on converstionDTO', () => {
    const contact1 = contactsService.create({name: 'shilo'});
    const contact2 = contactsService.create({name: 'maor'});
    const message = {
      from: contact1.id,
      members: [contact2.id, contact1.id],
      messageBody: 'Hi!'
    };
    conversationsService.addMessage(message);
    const conversation = conversationsService.listConversationsByContactId(contact2.id)[0];
    expect(conversation.unreadMessageCount).to.equal(1);
    const conversationId = conversation.id;
    conversationsService.ack({conversationId, contactId: contact2.id});
    const updatedConversation = conversationsService.listConversationsByContactId(contact2.id)[0];
    expect(updatedConversation.unreadMessageCount).to.equal(0);
  });

  it('should get number of unread messaged on converstionDTO - group scenraio', () => {
    const contact1 = contactsService.create({name: 'shilo'});
    const contact2 = contactsService.create({name: 'maor'});
    const contact3 = contactsService.create({name: 'david'});
    const message = {
      from: contact1.id,
      members: [contact2.id, contact1.id, contact3.id],
      messageBody: 'Hi!'
    };
    conversationsService.createGroup({
      members: [contact1.id, contact2.id, contact3.id],
      displayName: 'The Feebadges'
    });
    conversationsService.addMessage(message);
    const conversation = conversationsService.listConversationsByContactId(contact1.id)[0];
    const conversationId = conversation.id;
    conversationsService.ack({conversationId, contactId: contact2.id});
    expect(conversationsService.listConversationsByContactId(contact1.id)[0].unreadMessageCount).to.equal(0);
    expect(conversationsService.listConversationsByContactId(contact2.id)[0].unreadMessageCount).to.equal(0);
    expect(conversationsService.listConversationsByContactId(contact3.id)[0].unreadMessageCount).to.equal(1);
  });

  it('should include gravatar image when applicable', () => {
    const messageBody2 = 'Hello Kickstart!';
    conversationsService.addMessage({from: members[0], messageBody, members});
    const conversationId = conversationsService.addMessage({
      from: members[1],
      messageBody: messageBody2,
      members
    });

    const conversation = conversationsService.getMessagesById(conversationId);
    const conversationList1 = conversationsService.listConversationsByContactId(conversation.messages[0].createdBy);
    const conversationList2 = conversationsService.listConversationsByContactId(conversation.messages[1].createdBy);

    expect(conversationList1[0].imgUrl).to.equal('//www.gravatar.com/avatar/2dd3b8058e68863cf9d1aff3f581eb17');
    expect(conversationList2[0].imgUrl).to.equal('https://placeimg.com/60/60/animals');
  });

  it('should get unread messages on converstionDTO', () => {
    const contact1 = contactsService.create({name: 'shilo'});
    const contact2 = contactsService.create({name: 'maor'});
    const message1 = {
      from: contact1.id,
      members: [contact2.id, contact1.id],
      messageBody: 'Hi!'
    };
    const message2 = {
      from: contact1.id,
      members: [contact2.id, contact1.id],
      messageBody: 'How are you?!'
    };
    conversationsService.addMessage(message1);
    conversationsService.addMessage(message2);
    const conversation = conversationsService.listConversationsByContactId(contact2.id)[0];
    expect(conversation.unreadMessages).to.eql([message1.messageBody, message2.messageBody]);
    const conversationId = conversation.id;
    conversationsService.ack({conversationId, contactId: contact2.id});
    const updatedConversation = conversationsService.listConversationsByContactId(contact2.id)[0];
    expect(updatedConversation.unreadMessages).to.eql([]);
  });

  it('should get unread messages on converstionDTO - group scenraio', () => {
    const contact1 = contactsService.create({name: 'shilo'});
    const contact2 = contactsService.create({name: 'maor'});
    const contact3 = contactsService.create({name: 'david'});
    const message = {
      from: contact1.id,
      members: [contact2.id, contact1.id, contact3.id],
      messageBody: 'Hi!'
    };
    conversationsService.createGroup({
      members: [contact1.id, contact2.id, contact3.id],
      displayName: 'The Feebadges'
    });
    conversationsService.addMessage(message);
    const conversation = conversationsService.listConversationsByContactId(contact1.id)[0];
    const conversationId = conversation.id;
    conversationsService.ack({conversationId, contactId: contact2.id});
    expect(conversationsService.listConversationsByContactId(contact1.id)[0].unreadMessages).to.eql([]);
    expect(conversationsService.listConversationsByContactId(contact2.id)[0].unreadMessages).to.eql([]);
    expect(conversationsService.listConversationsByContactId(contact3.id)[0].unreadMessages).to.eql([message.messageBody]);
  });
});
