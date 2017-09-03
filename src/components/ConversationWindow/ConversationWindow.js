import React from 'react';
import PropTypes from 'prop-types';
import Input from 'wix-style-react/dist/src/Input';
import Text from 'wix-style-react/dist/src/Text';
import MessageBubble from '../MessageBubble';
import {observer, inject} from 'mobx-react';
import * as s from './ConversationWindow.scss';


@inject('chatStore')
@observer
class ConversationWindow extends React.Component {
  constructor() {
    super();
    this.state = {newMessage: ''};
  }

  onMessageSend() {
    if (this.state.newMessage !== '') {
      this.props.onSendMessage(this.state.newMessage);
      this.setState({newMessage: ''});
    }

  }

  render() {
    const {chatStore} = this.props;
    return (
      <div data-hook="conversation-window" className={s.conversationWindow}>
        <div className={s.conversationInfo}>
          <div className={s.imgHolder}>
            <img src="https://placeimg.com/60/60/animals" alt="Conversation Picture"/>
          </div>
          <div className={s.textContainer}>
            <Text appearance="T2" dataHook="conversation-window-display-name">{chatStore.conversationDisplayName && chatStore.conversationDisplayName}</Text>
          </div>
        </div>
        <ul className={s.messagesContainer}>
          {chatStore.activeRelationConversation.messages && chatStore.activeRelationConversation.messages.map(message =>
            <MessageBubble body={message.body} created={message.created} id={message.id} key={message.id}/>)}
        </ul>
        <Input
          dataHook="input-msg" value={this.state.newMessage} onChange={evt => this.setState({newMessage: evt.target.value})} onEnterPressed={() => this.onMessageSend()} unit="send"
          placeholder="Write Message..."
          />
      </div>
    );
  }
}

ConversationWindow.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  chatStore: PropTypes.object
};

export default ConversationWindow;
