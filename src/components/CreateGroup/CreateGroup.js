import React from 'react';
import {Input, Button, TextField, Label, MultiSelect} from 'wix-style-react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import ContactList from '../ContactList/ContactList';
import {BackArrow} from 'wix-style-react/dist/src/Icons';

@inject('chatStore')
@observer
class CreateGroup extends React.Component {
  constructor() {
    super();
    this.state = {
      membersInput: '',
      displayName: '',
      icon: ''
    };
  }

  render() {
    return (
      <div>
        <div>
          <Button dataHook="create-group" height="medium" theme="icon-standard" onClick={() => this.props.chatStore.hideCreateGroup()}><BackArrow/></Button>
          <div>Create Group</div>
        </div>
        <TextField>
          <Label appearance="T1.1" for="groupName">Group Name</Label>
          <Input id="groupName" dataHook="input-display-name" value={this.state.displayName} onChange={evt => this.setState({displayName: evt.target.value})}/>
        </TextField>
        <TextField>
          <Label appearance="T1.1" for="groupIcon">Group Icon</Label>
          {/*<div className={s.imgHolder}>*/}
          {/*<img src="https://placeimg.com/60/60/animals" alt="Conversation Picture"/>*/}
          {/*</div>*/}
          <Input id="groupIcon" dataHook="input-icon" value={this.state.icon} onChange={evt => this.setState({icon: evt.target.value})}/>
        </TextField>
        <div>
          <Label appearance="T1.1" for="members">Members</Label>
          <MultiSelect
            id="members"
            tags={this.props.chatStore.groupTags}
            onRemoveTag={tagId => this.props.chatStore.handleOnRemoveTag(tagId)}
            />
        </div>
        <ContactList
          username={this.props.chatStore.username} contacts={this.props.chatStore.groupDisplayContacts}
          onContactClick={(contactId, contactName) => this.props.chatStore.handleAddContact(contactId, contactName)}
          />
        <div>
          <Button
            dataHook="create-btn"
            onClick={() => this.props.chatStore.createGroup(this.state.displayName)}
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
