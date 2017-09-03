import React from 'react';
import PropTypes from 'prop-types';
import {observer, inject} from 'mobx-react';
import Login from '../Login';
import ChatView from '../ChatView';
import s from './App.scss';
import '../../main.scss';
import {RELATION_STATE} from '../../stores/ChatStore';
import Signup from '../Signup';
import {Route, Switch, Redirect} from 'react-router-dom';
import {withRouter} from 'react-router';

export class App extends React.Component {
  async onLoginClick(username) {
    const {chatStore} = this.props;
    await chatStore.login(username);
    chatStore.dataPolling();
    this.props.history.push('/chat');

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

  shouldRenderRoot(isLoggedIn) {
    return isLoggedIn ? <Redirect to="/chat"/> :
      <Login onLoginClick={username => this.onLoginClick(username)}/>;
  }

  shouldRenderSignup(isLoggedIn) {
    return isLoggedIn ? <Redirect to="/chat"/> : <Signup/>;
  }

  shouldRenderChat(chatStore) {
    return chatStore.isLoggedIn ? <ChatView sendMessage={messageBody => this.sendMessage(messageBody)}/> : <Redirect to="/login"/>;
  }


  render() {
    const {chatStore} = this.props;
    return (
      <div className={s.root}>
        <Switch>
          <Route exact path="/" render={() => this.shouldRenderRoot(chatStore.isLoggedIn)}/>
          <Route path="/login" render={() => this.shouldRenderRoot(chatStore.isLoggedIn)}/>
          <Route exact path="/signup" render={() => this.shouldRenderSignup(chatStore.isLoggedIn)}/>
          <Route path="/chat" render={() => this.shouldRenderChat(chatStore)}/>
        </Switch>
      </div>
    );
  }
}


App.propTypes = {
  chatStore: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(inject('chatStore')(observer(App)));
