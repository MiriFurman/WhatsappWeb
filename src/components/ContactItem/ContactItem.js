import React from 'react';
import {Text} from 'wix-style-react';
import PropTypes from 'prop-types';
import * as s from './ContactItem.scss';

const dummyImg = 'https://placeimg.com/60/60/animals';

const ContactItem = ({id, name, imageUrl, onContactClick}) => (
  <div className={s.contactItem} data-hook="contact-item" onClick={() => onContactClick(id, name)}>
    <div className={s.imgHolder}>
      <img data-hook="contact-img" src={imageUrl ? imageUrl : dummyImg} alt=""/>
    </div>
    <div className={s.textContainer}>
      <Text appearance="T2" dataHook="contact-display-name">{name}</Text>
    </div>
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

