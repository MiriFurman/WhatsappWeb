import React from 'react';
import PropTypes from 'prop-types';
import {Text} from 'wix-style-react';
import * as s from './ConversationItem.scss';

const ConversationItem = ({id, onConversationClick, displayName}) => (
  <div className={s.conversationItem} data-hook="conversation-item" onClick={() => onConversationClick(id)}>
    <div className={s.imgHolder}>
      <img src="https://placeimg.com/60/60/animals" alt="Conversation Picture"/>
    </div>
    <div className={s.textContainer}>
      <Text appearance="T2" dataHook="conversation-display-name">{displayName}</Text>
      <Text appearance="T3.1" dataHook="conversation-last-message">Last message placeholder</Text>
    </div>
  </div>
);

ConversationItem.propTypes = {
  id: PropTypes.string.isRequired,
  onConversationClick: PropTypes.func.isRequired,
  displayName: PropTypes.string.isRequired
};
export default ConversationItem;
