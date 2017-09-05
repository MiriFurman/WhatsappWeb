import {expect} from 'chai';
import React from 'react';
import {mount} from 'enzyme';
import ConversationList from './ConversationList';

describe('Conversation List Component tests', () => {
  const render = props => mount(
    <ConversationList
      {...props} startConversation={() => {
      }} chatStore={{filteredVal: ''}}
         />, {attachTo: document.createElement('div')});
  it('should render conversation on conversation list', () => {
    const conversations = [
      {
        id: '1',
        displayName: 'Shilo',
        lastMessage: {
          body: 'Hi!',
          created: new Date()
        },
        onConversationClick: () => {
        }
      },
      {
        id: '2',
        displayName: 'Dany',
        lastMessage: {body: 'Hello!', created: new Date(0)},
        onConversationClick: () => {
        }
      }
    ];
    const wrapper = render({conversations});
    expect(wrapper.find('[data-hook="conversation-item"]')).to.have.lengthOf(2);
  });
  it('should sort conversations by last message sent', () => {
    const date1 = new Date(10000);
    const date2 = new Date(20000);

    const conversations = [
      {
        id: '1',
        displayName: 'Shilo',
        lastMessage: {
          body: 'Hi',
          created: date1
        },
        onConversationClick: () => {
        }
      },
      {
        id: '2',
        displayName: 'Dany',
        lastMessage: {
          body: 'Hello!',
          created: date2
        },
        onConversationClick: () => {
        },
      }
    ];
    const wrapper = render({conversations});
    expect(wrapper.find('[data-hook="conversation-item"]').at(0).text()).to.include(conversations[1].displayName);
  });


});
