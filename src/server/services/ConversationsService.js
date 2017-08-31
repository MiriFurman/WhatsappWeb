import uuid from 'uuid';
import xor from 'lodash/xor';
import {contactsService} from './ContactsService';

let conversations = {};

const createMessage = ({from, body, conversationId}) => {
  return {
    id: uuid.v4(),
    body,
    conversationId,
    created: new Date(),
    createdBy: from
  };
};

const getConversationByMembers = members => {
  return Object.values(conversations)
    .find(conversation => xor(conversation.members, members).length === 0);
};

const createConversation = ({conversationId, members, firstMessage}) => ({
  id: conversationId,
  members: [...members],
  messages: [firstMessage]
});

const addMessage = ({from, messageBody, members}) => {
  const conversationId = uuid.v4();
  const newMessage = createMessage({from, body: messageBody, conversationId});

  let conversation = getConversationByMembers(members);
  if (conversation) {
    newMessage.conversationId = conversation.id;
    conversation.messages.push(newMessage);
  } else {
    conversation = createConversation({conversationId, members, firstMessage: newMessage});
    conversations[conversationId] = conversation;
  }

  return conversation.id;
};

const getMessagesById = id => {
  if (!conversations[id]) {
    throw new Error(`Conversation not found: ${id}`);
  }

  return conversations[id];
};

const otherMember = (conversation, contactId) => conversation.members.find(member => member !== contactId);
const contactById = contactId => contactsService.getById(contactId);

const listConversationsByContactId = contactId => {
  return Object.values(conversations)
    .filter(conversation => conversation.members.includes(contactId))
    .map(conversation => ({
      id: conversation.id,
      members: conversation.members,
      displayName: contactById(otherMember(conversation, contactId)).name
    }));
};

const reset = () => conversations = {};

export const conversationsService = {
  addMessage,
  getMessagesById,
  listConversationsByContactId,
  reset
};
