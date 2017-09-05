import React from 'react';
import PropTypes from 'prop-types';
import Text from 'wix-style-react/dist/src/Text';
import MessageBubble from '../MessageBubble';
import {observer, inject} from 'mobx-react';
import * as s from './ConversationWindow.scss';
import map from 'lodash/map';

const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '😘', '😗', '😙', '😚', '😋', '😜', '😝', '😛', '🤑', '🤗', '🤓', '😎', '🤡', '🤠', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '😣', '😖', '😫', '😩', '😤', '😠', '😡', '😶', '😐', '😑', '😯', '😦', '😧', '😮', '😲', '😵', '😳', '😱', '😨', '😰', '😢', '😥', '🤤', '😭', '😓', '😪', '😴', '🙄', '🤔', '🤥', '😬', '🤐', '🤢', '🤧', '😷', '🤒', '🤕', '😈', '👿', '👹', '👺', '💩', '👻', '💀', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '👐', '🙌', '👏', '🙏', '🤝', '👍', '👎', '👊', '✊', '🤛', '🤜', '🤞'];

@inject('chatStore')
@observer
class ConversationWindow extends React.Component {
  constructor() {
    super();
    this.state = {newMessage: '', showEmoji: false};
  }

  onMessageSend() {
    if (!(/^(?:\s|\n|\n\r)*$/.test(this.state.newMessage))) {
      this.props.onSendMessage(this.state.newMessage);
      this.setState({newMessage: '', showEmoji: false});
    }
  }

  isGroupMessage() {
    const {chatStore} = this.props;
    // console.log('json chatStore: ', JSON.stringify(chatStore));
    const result = chatStore.activeRelationConversation.members.length > 2;
    return result;
  }

  messageFromCurrentUser(message) {
    const {chatStore} = this.props;
    return chatStore.currentUser.id === message.createdBy;
  }

  handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.onMessageSend();
    }
  }

  addEmoji(emoji) {
    this.setState({newMessage: `${this.state.newMessage} ${emoji}`});
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
          {map(chatStore.activeRelationConversation.messages, message =>
            (<MessageBubble
              body={message.body}
              created={message.created}
              id={message.id}
              key={message.id}
              currentUser={this.messageFromCurrentUser(message)}
              groupMessage={this.isGroupMessage()}
              createdBy={message.createdBy}
              createdByName={chatStore.getUsernameByUserId(message.createdBy)}
              />)
          )}
        </ul>
        <div className={s.msgInputContainer}>
          <textarea data-hook="input-msg" value={this.state.newMessage} onChange={evt => this.setState({newMessage: evt.target.value})} onKeyPress={e => this.handleKeyPress(e)} placeholder="    Write Message..."/>
          <div className={s.buttonsContainer}>
            <button data-hook="emoji-btn" onClick={() => this.setState({showEmoji: !this.state.showEmoji})}>💩</button>
            <button data-hook="send-msg-btn" className={s.sendBtn} onClick={() => this.onMessageSend()}>send</button>
          </div>
          {this.state.showEmoji && <div data-hook="emoji-container" className={s.emojiContainer}>
              {emojis.map(emoji => <span key={emoji} onClick={() => this.addEmoji(emoji)}>{emoji}</span>)}
            </div>}
        </div>
      </div>
    );
  }
}

ConversationWindow.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  chatStore: PropTypes.object
};

export default ConversationWindow;
