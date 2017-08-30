import React from 'react';
import PropTypes from 'prop-types';
import {Text} from 'wix-style-react';

const ConversationItem = ({id, onConversationClick, displayName}) => (
  <div data-hook="conversation-item" onClick={() => onConversationClick(id)}>
    <Text dataHook="conversation-display-name">{displayName}</Text>
  </div>
);

ConversationItem.propTypes = {
  id: PropTypes.string.isRequired,
  onConversationClick: PropTypes.func.isRequired,
  displayName: PropTypes.string.isRequired
};
export default ConversationItem;
