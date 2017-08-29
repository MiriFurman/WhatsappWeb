/**
 * Created by mirif on 29/08/2017.
 */
import React from 'react';
import PropTypes from 'prop-types';

const ContactList = props => (
  <section>
    <ul data-hook="contact-list">{props.contacts
      .filter(contact => contact.name !== props.username)
      .map(contact =>
        (<li data-hook="contact-item" key={contact.id} onClick={() => props.startConversation(contact.id)}>{contact.name}</li>)
      )}
    </ul>
  </section>
);


ContactList.propTypes = {
  username: PropTypes.string.isRequired,
  contacts: PropTypes.array,
  startConversation: PropTypes.func.isRequired,
};

ContactList.defaultProps = {
  contacts: []
};

export default ContactList;
