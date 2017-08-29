import React from 'react';
import PropTypes from 'prop-types';
import ConversationWindow from '../ConversationWindow';
import ContactList from '../ContactList';
import ConversationList from '../ConversationList';

const ChatView = props => (
  <div>
    <div data-hook="username">{props.username}</div>
    <ContactList username={props.username} contacts={props.contacts} startConversation={props.startConversation}/>
    <ConversationList conversations={props.conversations}/>
    {!props.activeRelationId && <div data-hook="welcome-screen">Welcome to Wazzappppp</div>}
    {props.activeRelationId && <ConversationWindow onSendMessage={messageBody => props.sendMessage(messageBody)}/>}
  </div>
);

ChatView.propTypes = {
  username: PropTypes.string.isRequired,
  contacts: PropTypes.array,
  conversations: PropTypes.array,
  startConversation: PropTypes.func.isRequired,
  activeRelationId: PropTypes.string,
  sendMessage: PropTypes.func.isRequired
};

ChatView.defaultProps = {
  activeRelationId: null,
  contacts: [],
  conversations: [],
};

export default ChatView;

