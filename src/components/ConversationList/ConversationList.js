/**
 * Created by mirif on 29/08/2017.
 */
import React from 'react';
import PropTypes from 'prop-types';

const ConversationList = props => (
  <section>
    <ul data-hook="conversation-list">{props.conversations.map(conversation => (
      <li data-hook="conversation-item" key={conversation.id} onClick={() => props.startConversation(conversation.id, false)}>{conversation.displayName}</li>))}
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
