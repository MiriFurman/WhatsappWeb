import React from 'react';
import {Input, Button, TextField, Label, MultiSelect} from 'wix-style-react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import ContactList from '../ContactList/ContactList';
import {BackArrow} from 'wix-style-react/dist/src/Icons';
import * as s from './CreateGroup.scss';

@inject('chatStore')
@observer
class CreateGroup extends React.Component {
  constructor() {
    super();
    this.state = {
      membersInput: '',
      displayName: '',
      icon: '',
      displayNameError: false,
      membersError: false
    };
  }

  handleCreate() {
    if (this.state.displayName === '') {
      this.setState({displayNameError: true});
    } else {
      this.setState({displayNameError: false});
      this.props.chatStore.createGroup(this.state.displayName);
    }
  }

  render() {
    return (
      <div className={s.createGroupPanel}>
        <div className={s.createGroupHeading}>
          <div className={s.topLeft}>
            <Button dataHook="create-group-go-back-btn" height="medium" theme="icon-whitesecondary" onClick={() => this.props.chatStore.hideCreateGroup()}><BackArrow/></Button>
          </div>
          <div className={s.heading}>Create Group</div>
        </div>
        <div className={s.groupInfo}>
          <div className={s.nameSection}>
            <TextField>
              <Label appearance="T1.1" for="groupName">Group Name</Label>
              {!this.state.displayNameError && <Input id="groupName" dataHook="input-group-name" value={this.state.displayName} onChange={evt => this.setState({displayName: evt.target.value})}/>}
              {this.state.displayNameError && <Input id="groupName" dataHook="input-group-name" value={this.state.displayName} onChange={evt => this.setState({displayName: evt.target.value})} error errorMessage="Group name is required!"/>}
            </TextField>
          </div>
          <div className={s.iconSection}>
            <div className={s.iconInput}>
              <TextField>
                <Label appearance="T1.1" for="groupIcon">Group Icon</Label>
                <Input id="groupIcon" dataHook="input-icon" value={this.state.icon} onChange={evt => this.setState({icon: evt.target.value})}/>
              </TextField>
            </div>
            <div className={s.imgHolder}>
              <img src="https://placeimg.com/60/60/animals" alt="Conversation Picture"/>
            </div>
          </div>
          <div className={s.memberSection}>
            <Label appearance="T1.1" for="members">Members</Label>
            <MultiSelect
              id="members"
              tags={this.props.chatStore.groupTags}
              onRemoveTag={tagId => this.props.chatStore.handleOnRemoveTag(tagId)}
              />
          </div>
        </div>
        <div className={s.contactsSection}>
          <ContactList
            username={this.props.chatStore.username} contacts={this.props.chatStore.groupDisplayContacts}
            onContactClick={(contactId, contactName) => this.props.chatStore.handleAddContact(contactId, contactName)}
            />
        </div>
        <div className={s.createBtnSection}>
          <Button
            dataHook="create-group-btn"
            onClick={() => this.handleCreate()}
            >Create</Button>
        </div>
      </div>
    );
  }
}

CreateGroup.propTypes = {
  chatStore: PropTypes.object.isRequired
};

export default CreateGroup;
