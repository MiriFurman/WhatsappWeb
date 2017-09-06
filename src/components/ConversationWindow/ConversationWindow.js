import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Text from 'wix-style-react/dist/src/Text';
import MessageBubble from '../MessageBubble';
import {observer, inject} from 'mobx-react';
import * as s from './ConversationWindow.scss';
import map from 'lodash/map';

const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '😘', '😗', '😙', '😚', '😋', '😜', '😝', '😛', '🤑', '🤗', '🤓', '😎', '🤡', '🤠', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '😣', '😖', '😫', '😩', '😤', '😠', '😡', '😶', '😐', '😑', '😯', '😦', '😧', '😮', '😲', '😵', '😳', '😱', '😨', '😰', '😢', '😥', '🤤', '😭', '😓', '😪', '😴', '🙄', '🤔', '🤥', '😬', '🤐', '🤢', '🤧', '😷', '🤒', '🤕', '😈', '👿', '👹', '👺', '💩', '👻', '💀', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '👐', '🙌', '👏', '🙏', '🤝', '👍', '👎', '👊', '✊', '🤛', '🤜', '🤞'];

@inject('chatStore')
@observer
class ConversationWindow extends Component {
  constructor() {
    super();
    this.state = {newMessage: '', showEmoji: false, speechRecognition: false, isScrolled: false};
    this.recognition = new window.webkitSpeechRecognition(); // eslint-disable-line
    this.recognition.onresult = ({results}) => {
      return this.setState({newMessage: results[0][0].transcript});
    };
    this.messageContainer = null;
  }

  componentDidMount() {
    const messageContainer = ReactDOM.findDOMNode(this.messageContainer);//eslint-disable-line
    messageContainer.addEventListener('scroll', () => this.setState({isScrolled: true}));
  }

  componentWillUnmount() {
    const messageContainer = ReactDOM.findDOMNode(this.messageContainer);//eslint-disable-line
    messageContainer.removeEventListener('scroll', () => this.setState({isScrolled: false}));
  }

  componentDidUpdate() {
    if (!this.state.isScrolled) {
      const messageContainer = ReactDOM.findDOMNode(this.messageContainer);//eslint-disable-line
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }

  onMessageSend() {
    if (!(/^(?:\s|\n|\n\r)*$/.test(this.state.newMessage))) {
      this.props.onSendMessage(this.state.newMessage);
      this.setState({newMessage: '', showEmoji: false, isScrolled: false});
    }
  }

  isGroupMessage() {
    const {chatStore} = this.props;
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

  onMicClicked() {
    const {speechRecognition} = this.state;
    speechRecognition ? this.recognition.stop() : this.recognition.start();
    this.setState({speechRecognition: !this.state.speechRecognition});
  }


  addEmoji(emoji) {
    this.setState({newMessage: `${this.state.newMessage} ${emoji}`});
  }

  msgSpeak(msg) {
    const text = new SpeechSynthesisUtterance(msg);
    if (/[\u0590-\u05FF]/.test(msg)) {
      text.lang = 'he';
    }
    window.speechSynthesis.speak(text);
  }

  render() {
    const {chatStore} = this.props;
    const {speechRecognition} = this.state;
    return (
      <div data-hook="conversation-window" className={s.conversationWindow}>
        <div className={s.conversationInfo}>
          <div className={s.imgHolder}>
            <img
              data-hook="gravatar-image"
              src={
              chatStore.contacts &&
              chatStore.contacts.length > 0 &&
              chatStore.contacts.find(contact => contact.id === chatStore.currentUser.id).imageUrl}
              alt="Conversation Picture"
              />
          </div>
          <div className={s.textContainer}>
            <Text
              appearance="T2"
              dataHook="conversation-window-display-name"
              >{chatStore.conversationDisplayName && chatStore.conversationDisplayName}</Text>
          </div>
        </div>
        <ul className={s.messagesContainer} ref={ref => this.messageContainer = ref}>
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
              msgSpeak={this.msgSpeak}
              />)
          )}
        </ul>
        <div className={s.msgInputContainer}>
          <textarea
            disabled={speechRecognition}
            data-hook="input-msg" value={this.state.newMessage}
            onChange={evt => this.setState({newMessage: evt.target.value})}
            onKeyPress={e => this.handleKeyPress(e)} placeholder="Write a Message..."
                                                     />
          {speechRecognition && <div className={s.speechIndicator}/>}
          <div className={s.buttonsContainer}>
            <button
              data-hook="emoji-btn"
              onClick={() => this.setState({showEmoji: !this.state.showEmoji})}
              >💩
            </button>
            <button
              data-hook="mic-btn" onClick={() => this.onMicClicked()}
                                  >🎤
            </button>
            <button
              data-hook="send-msg-btn" className={s.sendBtn}
              onClick={() => this.onMessageSend()}
              >send
            </button>
          </div>
          {this.state.showEmoji && <div data-hook="emoji-container" className={s.emojiContainer}>
            {emojis.map(emoji => <span
              key={emoji}
              onClick={() => this.addEmoji(emoji)}
              >{emoji}</span>)}
          </div>
          }
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
