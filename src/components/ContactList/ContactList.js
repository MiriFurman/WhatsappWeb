import React from 'react';
import PropTypes from 'prop-types';
import ContactItem from '../ContactItem';
import * as s from './ContactList.scss';
import {Text} from 'wix-style-react';

const ContactList = props => (
  <section className={s.contactList}>
    <div className={s.contactHeader}>
      <Text>CONTACTS</Text>
    </div>
    <ul data-hook="contact-list">{props.contacts
      .filter(contact => contact.name !== props.username)
      .map(contact =>
        (<li key={contact.id}>
          <ContactItem {...contact} onContactClick={(contactId, contactName) => props.onContactClick(contactId, contactName)}/>
        </li>)
      )}
    </ul>
  </section>
);


ContactList.propTypes = {
  username: PropTypes.string.isRequired,
  contacts: PropTypes.array,
  onContactClick: PropTypes.func.isRequired,
};

ContactList.defaultProps = {
  contacts: []
};

export default ContactList;
