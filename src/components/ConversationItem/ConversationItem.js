import React from 'react';
import PropTypes from 'prop-types';
import {Text} from 'wix-style-react';
import * as s from './ConversationItem.scss';

const dummyImg = 'https://placeimg.com/60/60/animals';

const ConversationItem = ({id, onConversationClick, displayName, imageUrl, lastMessage}) => (
  <div className={s.conversationItem} data-hook="conversation-item" onClick={() => onConversationClick(id)}>
    <div className={s.imgHolder}>
      <img data-hook="contact-img" src={imageUrl ? imageUrl : dummyImg} alt="Conversation Picture"/>
    </div>
    <div className={s.textContainer}>
      <Text appearance="T2" dataHook="conversation-display-name">{displayName}</Text>
      <Text appearance="T3.1" dataHook="conversation-last-message">{lastMessage.body}</Text>
    </div>
  </div>
);

ConversationItem.propTypes = {
  id: PropTypes.string.isRequired,
  onConversationClick: PropTypes.func.isRequired,
  displayName: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  lastMessage: PropTypes.string
};
ConversationItem.defaultProps = {
  lastMessage: ''
};
export default ConversationItem;
