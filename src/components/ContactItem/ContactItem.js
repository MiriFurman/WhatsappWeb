import React from 'react';
import {Text} from 'wix-style-react';
import PropTypes from 'prop-types';

const ContactItem = ({id, name, imageUrl, onContactClick}) => (
  <div onClick={() => onContactClick(id)} data-hook="contact-item">
    <img data-hook="contact-img" src={imageUrl ? imageUrl : ''} alt=""/>
    <Text dataHook="contact-display-name">{name}</Text>
  </div>
);

ContactItem.propTypes = {
  imageUrl: PropTypes.string,
  name: PropTypes.string.isRequired,
  onContactClick: PropTypes.func.isRequired,
  status: PropTypes.string,
  id: PropTypes.string.isRequired
};

export default ContactItem;

