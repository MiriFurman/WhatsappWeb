import React from 'react';
import PropTypes from 'prop-types';
import ConversationWindow from '../ConversationWindow';
import ContactList from '../ContactList';
import ConversationList from '../ConversationList';
import Welcome from '../Welcome';
import UserToolbar from '../UserToolbar';
import s from './ChatView.scss';
import {observer, inject} from 'mobx-react';

const ChatView = ({chatStore, sendMessage}) => (
  <div className={s.viewContainer}>
    <div className={s.chatViewContainer}>
      <div className={s.sidebar}>
        <UserToolbar username={chatStore.username}/>
        <ConversationList
          conversations={chatStore.conversations.toJS()}
          startConversation={conversationId => chatStore.startConversation(conversationId, false)}
          chatStore={chatStore}
          />
        <ContactList
          username={chatStore.username} contacts={chatStore.displayContacts}
          startConversation={contactId => chatStore.startConversation(contactId)}
          />
      </div>
      <div className={s.mainContent}>
        {!chatStore.activeRelationId && <Welcome/>}
        {chatStore.activeRelationId &&
        <ConversationWindow onSendMessage={messageBody => sendMessage(messageBody)}/>}
      </div>
    </div>
  </div>
);

ChatView.propTypes = {
  chatStore: PropTypes.object.isRequired,
  sendMessage: PropTypes.func.isRequired,
};

ChatView.defaultProps = {
  activeRelationId: null,
  contacts: [],
  conversations: [],
};

export default inject('chatStore')(observer(ChatView));

