import React from 'react';
import PropTypes from 'prop-types';
import {observer, inject} from 'mobx-react';
import Login from '../Login';
import ChatView from '../ChatView';
import s from './App.scss';
import '../../main.scss';
import {RELATION_STATE} from '../../stores/ChatStore';

@inject('chatStore')
@observer
class App extends React.Component {
  async onLoginClick(username) {
    const {chatStore} = this.props;
    await chatStore.login(username);
    chatStore.dataPolling();
  }

  sendMessage(messageBody) {
    const {chatStore} = this.props;
    const {currentUser, activeRelationId, activeRelationConversation} = chatStore;
    if (chatStore.relationState === RELATION_STATE.CONTACT) {
      chatStore.sendMessage(currentUser.id, [currentUser.id, activeRelationId], messageBody);
    } else {
      const {members} = activeRelationConversation;
      chatStore.sendMessage(currentUser.id, members, messageBody);
    }
  }

  render() {
    const {chatStore} = this.props;
    const {username, isLoggedIn, activeRelationId, conversations, displayContacts} = chatStore;
    return (
      <div className={s.root}>
        {!isLoggedIn && <Login onLoginClick={username => this.onLoginClick(username)}/>}
        {isLoggedIn && <ChatView
          username={username}
          activeRelationId={activeRelationId}
          contacts={displayContacts}
          conversations={conversations.toJS()}
          startConversation={(relationId, isNewConversation) => chatStore.startConversation(relationId, isNewConversation)}
          sendMessage={messageBody => this.sendMessage(messageBody)}
          />}
      </div>
    );
  }
}

App.propTypes = {
  chatStore: PropTypes.object
};


export default App;
