/**
 * Created by mirif on 28/08/2017.
 */
import {expect} from 'chai';
import sinon from 'sinon';
import {mount} from 'enzyme';
import React from 'react';
import ChatView from './ChatView';

describe('Chat View Component', () => {
  const username = 'Luke';
  const contacts = [{id: 1, name: 'Luke'}, {id: 2, name: 'Leah'}, {id: 3, name: 'Darth Vader'}];
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<ChatView username={username} contacts={contacts} startConversation={() => {}}/>);
  });

  it('should render contacts', () => {
    expect(wrapper.find('[data-hook="contact-item"]')
      .map(item => item.text())).to.eql([contacts[1].name, contacts[2].name]);
  });

  it('should show welcome screen when there is no conversation selected', () => {
    expect(wrapper.find('[data-hook="welcome-screen"]').exists()).to.equal(true);
  });

  it('should not show welcome screen when there is conversation selected', () => {
    wrapper.setProps({activeRelationId: contacts[1].id});
    expect(wrapper.find('[data-hook="welcome-screen"]').exists()).to.equal(false);
  });

  it('should invoke start conversation on relation click', () => {
    const spy = sinon.spy();
    wrapper.setProps({startConversation: spy});
    wrapper.find('[data-hook="contact-item"]').at(0).simulate('click');
    expect(spy.getCall(0).args).to.eql([contacts[1].id]);
  });
});
