import React from 'react';
import PropTypes from 'prop-types';
import ConversationItem from '../ConversationItem';
import * as s from './ConversationList.scss';

const ConversationList = props => (
  <section className={s.conversationList}>
    <ul data-hook="conversation-list">{props.conversations.map(conversation => (
      <li key={conversation.id}>
        <ConversationItem
          id={conversation.id}
          onConversationClick={conversationId => props.startConversation(conversationId, false)}
          displayName={conversation.displayName}
          />
      </li>))}
    </ul>
  </section>
);


ConversationList.propTypes = {
  conversations: PropTypes.array,
  startConversation: PropTypes.func.isRequired
};

ConversationList.defaultProps = {
  conversations: []
};

export default ConversationList;
