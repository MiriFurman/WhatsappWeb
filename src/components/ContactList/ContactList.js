import React from 'react';
import PropTypes from 'prop-types';
import ContactItem from '../ContactItem';

const ContactList = props => (
  <section>
    <ul data-hook="contact-list">{props.contacts
      .filter(contact => contact.name !== props.username)
      .map(contact =>
        (<li key={contact.id}>
          <ContactItem {...contact} onContactClick={contactId => props.startConversation(contactId)}/>
        </li>)
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
