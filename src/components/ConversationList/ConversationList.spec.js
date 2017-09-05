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

  it('should display the right gravatar images', () => {
    const conversations = [{
      id: 'b4ac4b43-775b-4db3-8586-524fbb7faa23',
      members: [
        '2dad7ca4-e96b-4f51-8236-8718e7274300',
        '8e65f3c4-d78c-4ee6-9e9d-f8cb48c77681'
      ],
      displayName: 'michaels@wix.com',
      lastMessage: {
        body: 'hi mikee',
        created: '2017-09-05T16:35:20.778Z'
      },
      unreadMessageCount: 0
    },
    {
      id: 'dc0ccb87-dfa6-4bb3-a7ed-2f752b429084',
      members: [
        '2dad7ca4-e96b-4f51-8236-8718e7274300',
        '776b4d38-d4cd-4824-9291-27d4c5973ef4'
      ],
      displayName: 'nirz@wix.com',
      imgUrl: '//www.gravatar.com/avatar/2dd3b8058e68863cf9d1aff3f581eb17',
      lastMessage: {
        body: 'hi nir',
        created: '2017-09-05T16:41:04.820Z'
      },
      unreadMessageCount: 0
    }
    ];
    const wrapper = render({conversations});
    expect(wrapper.find('[data-hook="contact-img"]').at(0).html()).to.include(conversations[1].imgUrl);
    expect(wrapper.find('[data-hook="contact-img"]').at(1).html()).to.include('src="https://placeimg.com/60/60/animals"');
  });
});
