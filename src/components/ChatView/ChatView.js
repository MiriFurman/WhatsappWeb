import React from 'react';
import PropTypes from 'prop-types';

export default function ChatView(props) {
  return (<div>
    <ul data-hook="contact-list">{props.contacts
      .filter(contact => contact.name !== props.userName)
      .map(contact =>
        (<li data-hook="contact-item" key={contact.id}>{contact.name}</li>)
      )}
    </ul>
    <div data-hook="username">{props.userName}</div>
  </div>
  );
}

ChatView.propTypes = {
  userName: PropTypes.string.isRequired,
  contacts: PropTypes.array
};
