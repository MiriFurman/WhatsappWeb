import React from 'react';
import {Text, Input} from 'wix-style-react';
import PropTypes from 'prop-types';
import * as s from './UserToolbar.scss';

const UserToolbar = ({username}) => (
  <div className={s.toolbarContainer}>
    <div className={s.userMgmt}>
      <div className={s.imgHolder}>
        <img src="https://placeimg.com/60/60/animals" alt="Conversation Picture"/>
      </div>
      <div className={s.textContainer}>
        <div className={s.userDetails}>
          <Text appearance="T2" dataHook="username">{username}</Text>
        </div>
        <div className={s.userActions}>
          +
        </div>
      </div>
    </div>
    <div className={s.searchContainer}>
      <Input magnifyingGlass placeholder="search"/>
    </div>
  </div>
);

UserToolbar.propTypes = {
  username: PropTypes.string.isRequired,
};

export default UserToolbar;
