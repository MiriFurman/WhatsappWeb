import {expect} from 'chai';
import {mount} from 'enzyme';
import React from 'react';
import ChatView from './ChatView';
import {Provider} from 'mobx-react';
import {configureStores} from '../../stores/configureStores';
import axios from 'axios';

describe('Chat View Component', () => {
  const username = 'Luke';
  const contacts = [{id: '1', name: 'Luke'}, {id: '2', name: 'Leah'}, {
    id: '3',
    name: 'Darth Vader'
  }];
  let wrapper;
  const mockChatStore = {
    contacts: {
      toJS: () => contacts,
      contacts
    },
    conversations: {
      toJS: () => []
    },
    displayContacts: contacts,
    username,
  };

  const render = (chatStore = mockChatStore) => {
    wrapper = mount(
      <Provider {...configureStores(axios)}>
        <ChatView chatStore={chatStore} sendMessage={() => {}} />
      </Provider>,
      {attachTo: document.createElement('div')}
    );
  };

  it('should render contacts', () => {
    render();
    expect(wrapper.find('[data-hook="contact-item"]')
      .map(item => item.text())).to.eql([contacts[1].name, contacts[2].name]);
  });

  it('should show welcome screen when there is no conversation selected', () => {
    render();
    expect(wrapper.find('[data-hook="welcome-screen"]').exists()).to.equal(true);
    expect(wrapper.find('[data-hook="conversation-window"]').exists()).to.equal(false);
  });

  it('should not show welcome screen when there is conversation selected', () => {
    const mockChatStore = {
      contacts: {
        toJS: () => contacts,
        contacts
      },
      conversations: {
        toJS: () => []
      },
      username,
      activeRelationId: contacts[1].id
    };
    render(mockChatStore);
    expect(wrapper.find('[data-hook="welcome-screen"]').exists()).to.equal(false);
    expect(wrapper.find('[data-hook="conversation-window"]').exists()).to.equal(true);
  });

});
