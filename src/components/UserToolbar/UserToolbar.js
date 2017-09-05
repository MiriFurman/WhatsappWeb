import React from 'react';
import {Text, Input, Button} from 'wix-style-react';
import PropTypes from 'prop-types';
import * as s from './UserToolbar.scss';
import {inject} from 'mobx-react';
import {Plus} from 'wix-style-react/dist/src/Icons';

export const UserToolbar = ({username, chatStore}) => (
  <div className={s.toolbarContainer}>
    <div className={s.userMgmt}>
      <div className={s.imgHolder}>
        <img data-hook="toolbar-gravatar" src={chatStore.contacts && chatStore.contacts.length > 0 && chatStore.contacts.find(contact => contact.id === chatStore.currentUser.id).imageUrl} alt="Conversation Picture"/>
      </div>
      <div className={s.textContainer}>
        <div className={s.userDetails}>
          <Text appearance="T2" dataHook="username">{username}</Text>
        </div>
        <div className={s.userActions}>
          <Button dataHook="create-group" height="medium" theme="icon-standardsecondary" onClick={() => chatStore.showCreateGroup()}><Plus/></Button>
        </div>
      </div>
    </div>
    <div className={s.searchContainer}>
      <Input magnifyingGlass dataHook="search-conversation" placeholder="search" onChange={e => chatStore.filterBy(e.target.value)}/>
    </div>
  </div>
);

UserToolbar.propTypes = {
  username: PropTypes.string.isRequired,
  chatStore: PropTypes.object.isRequired
};

export default inject('chatStore')(UserToolbar);
