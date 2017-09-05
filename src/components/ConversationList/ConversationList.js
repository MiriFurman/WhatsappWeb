import React from 'react';
import PropTypes from 'prop-types';
import ConversationItem from '../ConversationItem';
import * as s from './ConversationList.scss';

const sortDates = (conversationA, conversationB) =>
  (new Date(conversationB.lastMessage && conversationB.lastMessage.created) - new Date(conversationA.lastMessage && conversationA.lastMessage.created)) || 1;

const ConversationList = props => (
  <section className={s.conversationList}>
    <ul data-hook="conversation-list">{props.conversations
      .filter(conversation => conversation.displayName.toLowerCase().includes(props.chatStore.filteredVal))
      .sort(sortDates)
      .map(conversation => (
        <li key={conversation.id}>
          <ConversationItem
            id={conversation.id}
            onConversationClick={conversationId => props.startConversation(conversationId, false)}
            displayName={conversation.displayName}
            lastMessage={conversation.lastMessage}
            unreadMessageCount={conversation.unreadMessageCount}
            />
        </li>))}
    </ul>
  </section>
);


ConversationList.propTypes = {
  conversations: PropTypes.array,
  startConversation: PropTypes.func.isRequired,
  chatStore: PropTypes.object.isRequired,
  unreadMessageCount: PropTypes.string
};

ConversationList.defaultProps = {
  conversations: []
};

export default ConversationList;
