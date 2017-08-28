import React from 'react';
import PropTypes from 'prop-types';

export default function ChatView(props) {
  return (<div>
    <ul data-hook="contact-list">{props.contacts
      .filter(contact => contact.name !== props.username)
      .map(contact =>
        (<li data-hook="contact-item" key={contact.id} onClick={() => props.startConversation(contact.id)}>{contact.name}</li>)
      )}
    </ul>
    { !props.activeRelation && <div data-hook="welcome-screen">Welcome to Wazzappppp</div>}
    <div data-hook="username">{props.username}</div>
  </div>
  );
}

ChatView.propTypes = {
  username: PropTypes.string.isRequired,
  contacts: PropTypes.array,
  startConversation: PropTypes.func.isRequired,
  activeRelation: PropTypes.string
};

ChatView.defaultProps = {
  activeRelation: null
};
