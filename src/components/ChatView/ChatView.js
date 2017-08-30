import React from 'react';
import PropTypes from 'prop-types';
import ConversationWindow from '../ConversationWindow';
import ContactList from '../ContactList';
import ConversationList from '../ConversationList';
import Welcome from '../Welcome';
import UserToolbar from '../UserToolbar';
import s from './ChatView.scss';

const ChatView = props => (
  <div className={s.viewContainer}>
    <div className={s.chatViewContainer}>
      <div className={s.sidebar}>
        <UserToolbar username={props.username}/>
        <ConversationList conversations={props.conversations} startConversation={props.startConversation}/>
        <ContactList username={props.username} contacts={props.contacts} startConversation={props.startConversation}/>
      </div>
      <div className={s.mainContent}>
        {!props.activeRelationId && <Welcome/>}
        {props.activeRelationId && <ConversationWindow onSendMessage={messageBody => props.sendMessage(messageBody)}/>}
      </div>
    </div>
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

