import React from 'react';
import PropTypes from 'prop-types';
import ConversationItem from '../ConversationItem';
import * as s from './ConversationList.scss';

const ConversationList = props => (
  <section className={s.conversationList}>
    <ul data-hook="conversation-list">{props.conversations
      .filter(conversation => conversation.displayName.toLowerCase().includes(props.chatStore.filteredVal))
      .map(conversation => (
        <li key={conversation.id}>
          <ConversationItem
            id={conversation.id}
            onConversationClick={conversationId => props.startConversation(conversationId, false)}
            displayName={conversation.displayName}
            lastMessage={conversation.lastMessage}
            />
        </li>))}
    </ul>
  </section>
);


ConversationList.propTypes = {
  conversations: PropTypes.array,
  startConversation: PropTypes.func.isRequired,
  chatStore: PropTypes.object.isRequired
};

ConversationList.defaultProps = {
  conversations: []
};

export default ConversationList;
