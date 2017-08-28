import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import Login from '../Login';
import ChatView from '../ChatView';
import s from './App.scss';

@observer class App extends React.Component {
  onLoginClick(username) {
    const {chatStore} = this.props;
    chatStore.login(username);
  }

  render() {
    const {chatStore} = this.props;
    const {username, isLoggedIn, contacts} = chatStore;
    return (
      <div className={s.root}>
        {!isLoggedIn && <Login onLoginClick={username => this.onLoginClick(username)}/>}
        {isLoggedIn && <ChatView username={username} contacts={contacts.toJS()}/>}
      </div>
    );
  }
}

App.propTypes = {
  chatStore: PropTypes.object.isRequired
};

export default App;
