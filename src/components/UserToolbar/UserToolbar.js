import React from 'react';
import {Text, Input} from 'wix-style-react';
import PropTypes from 'prop-types';
import noImg from './../../assets/no-image.png';
import * as s from './UserToolbar.scss';

const UserToolbar = ({username, imageUrl}) => (
  <div className={s.toolbarContainer}>
    <div className={s.userMgmt}>
      <div className={s.userDetails}>
        <img data-hook="user-img" src={imageUrl ? imageUrl : noImg} alt=""/>
        <Text dataHook="username">{username}</Text>
      </div>
      <div className={s.userActions}>
        +
      </div>
    </div>
    <div className={s.searchContainer}>
      <Input magnifyingGlass placeholder="search"/>
    </div>
  </div>
);

UserToolbar.propTypes = {
  username: PropTypes.string.isRequired,
  imageUrl: PropTypes.string
};

export default UserToolbar;
