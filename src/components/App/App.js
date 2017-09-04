import React, {Component} from 'react';
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

@withRouter
@inject('chatStore')
@observer
class App extends Component {
  async onLoginClick(user) {
    const {chatStore} = this.props;
    const authenUser = await chatStore.login(user);
    if (authenUser) {
      chatStore.dataPolling();
      this.props.history.push('/chat');
    }
  }

  async onSignupClick(username, password, imgUrl = '') {
    const {chatStore} = this.props;
    await chatStore.signup({username, password, imgUrl});
    this.props.history.push('/login');
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
    <Login onLoginClick={user => this.onLoginClick(user)}/>;
  }

  shouldRenderSignup(isLoggedIn) {
    return isLoggedIn ? <Redirect to="/chat"/> :
    <Signup onSignupClick={(username, password) => this.onSignupClick(username, password)}/>;
  }

  shouldRenderChat(chatStore) {
    return chatStore.isLoggedIn ?
      <ChatView sendMessage={messageBody => this.sendMessage(messageBody)}/> :
      <Redirect to="/login"/>;
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

export default App;
