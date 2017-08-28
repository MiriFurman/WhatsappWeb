import React from 'react';
import PropTypes from 'prop-types';
import Input from 'wix-style-react/dist/src/Input';
import Button from 'wix-style-react/dist/src/Button';

class ConversationWindow extends React.Component {
  constructor() {
    super();

    this.state = {newMessage: ''};
  }

  render() {
    return (<div data-hook="conversation-window">
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
  onSendMessage: PropTypes.func.isRequired
};

export default ConversationWindow;
