import React from 'react';
import PropTypes from 'prop-types';

export default function ChatView(props) {
  return (<div>
    <ul data-hook="contact-list">{props.contacts
      .filter(contact => contact.name !== props.username)
      .map(contact =>
        (<li data-hook="contact-item" key={contact.id}>{contact.name}</li>)
      )}
    </ul>
    <div data-hook="username">{props.username}</div>
  </div>
  );
}

ChatView.propTypes = {
  username: PropTypes.string.isRequired,
  contacts: PropTypes.array
};
