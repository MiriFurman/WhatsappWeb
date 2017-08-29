import React from 'react';
import PropTypes from 'prop-types';
import Input from 'wix-style-react/dist/src/Input';
import Button from 'wix-style-react/dist/src/Button';
import {observer, inject} from 'mobx-react';

@inject('chatStore')
@observer
class ConversationWindow extends React.Component {
  constructor() {
    super();
    this.state = {newMessage: ''};
  }

  render() {
    const {chatStore} = this.props;
    return (<div data-hook="conversation-window">
      <ul className="messages-container">
        {chatStore.activeRelationConversation.messages && chatStore.activeRelationConversation.messages.map(message =>
          <li key={message.id} data-hook="msg-item">{message.body}</li>)}
      </ul>

      <Input
        dataHook="input-msg"
        onChange={evt => this.setState({newMessage: evt.target.value})}
        />
      <Button
        dataHook="send-msg"
        onClick={() => this.props.onSendMessage(this.state.newMessage)}
        />
    </div>);
  }
}

ConversationWindow.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  chatStore: PropTypes.object
};

export default ConversationWindow;
