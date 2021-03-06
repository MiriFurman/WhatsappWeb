import {expect} from 'chai';
import sinon from 'sinon';
import {mount} from 'enzyme';
import React from 'react';
import ConversationItem from './ConversationItem';
import {textTestkitFactory, badgeTestkitFactory} from 'wix-style-react/dist/testkit/enzyme';


describe('conversation item component tests', () => {
  const render = (props = {}) => (
    mount(
      <ConversationItem {...props}/>,
      {attachTo: document.createElement('div')}
    )
  );
  it('should render conversationItem component successfully', () => {
    const propObject = {
      id: '1',
      displayName: 'Shilo',
      onConversationClick: () => {
      }
    };
    const wrapper = render(propObject);
    expect(textTestkitFactory({
      wrapper,
      dataHook: 'conversation-display-name'
    }).getText()).to.equal(propObject.displayName);
  });
  it('should call onConversationClick on click', () => {
    const spy = sinon.spy();
    const propObject = {
      id: '1',
      displayName: 'Shilo',
      onConversationClick: spy
    };
    const wrapper = render(propObject);
    wrapper.find('[data-hook="conversation-item"]').at(0).simulate('click');
    expect(spy.getCall(0).args).to.eql([propObject.id]);
  });
  it('should show last message on conversation-item', () => {
    const propObject = {
      id: '1',
      displayName: 'Shilo',
      onConversationClick: () => {
      },
      lastMessage: {
        body: 'Hi',
        created: new Date()
      }
    };
    const wrapper = render(propObject);
    expect(textTestkitFactory({
      wrapper,
      dataHook: 'conversation-last-message'
    }).getText()).to.equal(propObject.lastMessage.body);
  });
  it('should show unread message count on conversationItem', () => {
    const propObject = {
      id: '1',
      displayName: 'Shilo',
      onConversationClick: () => {
      },
      lastMessage: {
        body: 'Hi',
        created: new Date()
      },
      unreadMessageCount: 5
    };
    const wrapper = render(propObject);
    const dataHook = 'unread-message-count';
    const badge = badgeTestkitFactory({wrapper, dataHook});
    expect(badge.exists()).to.be.equal(true);
    expect(badge.text()).to.be.equal('' + propObject.unreadMessageCount);
  });
  it('should not show unread message count when count is zero', () => {
    const propObject = {
      id: '1',
      displayName: 'Shilo',
      onConversationClick: () => {
      },
      lastMessage: {
        body: 'Hi',
        created: new Date()
      },
      unreadMessageCount: 0
    };
    const wrapper = render(propObject);
    const dataHook = 'unread-message-count';
    const badge = badgeTestkitFactory({wrapper, dataHook});
    expect(badge.exists()).to.be.equal(false);
  });
});
