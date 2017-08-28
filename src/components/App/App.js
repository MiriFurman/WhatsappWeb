import React from 'react';
import PropTypes from 'prop-types';
import {observer, inject} from 'mobx-react';
import Login from '../Login';
import ChatView from '../ChatView';
import s from './App.scss';

@inject('chatStore')
@observer class App extends React.Component {
  onLoginClick(username) {
    const {chatStore} = this.props;
    chatStore.login(username);
  }

  render() {
    const {chatStore} = this.props;
    const {username, isLoggedIn, contacts, currentUser, activeRelationId, conversations} = chatStore;
    return (
      <div className={s.root}>
        {!isLoggedIn && <Login onLoginClick={username => this.onLoginClick(username)}/>}
        {isLoggedIn && <ChatView
          username={username}
          activeRelationId={activeRelationId}
          contacts={contacts.toJS()}
          conversations={conversations.toJS()}
          startConversation={relationId => chatStore.startConversation(relationId)}
          sendMessage={messageBody => chatStore.sendMessage(currentUser.id, [currentUser.id, activeRelationId], messageBody)}
          />}
      </div>
    );
  }
}

App.propTypes = {
  chatStore: PropTypes.object.isRequired
};

export default App;
