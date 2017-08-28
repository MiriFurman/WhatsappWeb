import React from 'react';
import PropTypes from 'prop-types';
import ConversationWindow from '../ConversationWindow/ConversationWindow';

export default function ChatView(props) {
  return (<div>
    <ul data-hook="contact-list">{props.contacts
        .filter(contact => contact.name !== props.username)
        .map(contact =>
          (<li
            data-hook="contact-item" key={contact.id}
            onClick={() => props.startConversation(contact.id)}
            >{contact.name}</li>)
        )}
    </ul>
    <ul data-hook="conversation-list">{props.conversations
        .map(conversation =>
          (<li
            data-hook="conversation-item" key={conversation.id}
                                          >{conversation.displayName}</li>)
        )}
    </ul>
    {!props.activeRelationId && <div data-hook="welcome-screen">Welcome to Wazzappppp</div>}
    {props.activeRelationId &&
      <ConversationWindow
        onSendMessage={messageBody => {
          props.sendMessage(messageBody);
        }}
        />
      }
    <div data-hook="username">{props.username}</div>
  </div>
  );
}

ChatView.propTypes = {
  username: PropTypes.string.isRequired,
  contacts: PropTypes.array,
  conversations: PropTypes.array,
  startConversation: PropTypes.func.isRequired,
  activeRelationId: PropTypes.string,
  sendMessage: PropTypes.func.isRequired
};

ChatView.defaultProps = {
  activeRelationId: null,
  contacts: [],
  conversations: [],
};
