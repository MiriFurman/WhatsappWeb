import chai, {expect} from 'chai';
import {mount} from 'enzyme';
import React from 'react';
import CreateGroup from './CreateGroup';
import {buttonTestkitFactory, inputTestkitFactory} from 'wix-style-react/dist/testkit/enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

describe('Create Group component test', () => {
  const render = (props = {}) => (
    mount(
      <CreateGroup {...props}/>,
      {attachTo: document.createElement('div')}
    )
  );

  it('should render contacts', () => {
    const contacts = [
      {id: '1', name: 'Peter'},
      {id: '2', name: 'Lois'},
      {id: '3', name: 'Brian'},
      {id: '4', name: 'Stewie'}
    ];
    const propsObj = {
      chatStore: {
        username: 'Peter',
        groupDisplayContacts: contacts
      }
    };
    const wrapper = render(propsObj);
    expect(wrapper.find('[data-hook="contact-item"]')
      .map(item => item.text())).to.eql([contacts[1].name, contacts[2].name, contacts[3].name]);
  });

  it('should call handleAddContact when clicking on contact', () => {
    const spy = sinon.spy();
    const contacts = [
      {id: '1', name: 'Peter'},
      {id: '2', name: 'Lois'},
      {id: '3', name: 'Brian'},
      {id: '4', name: 'Stewie'}
    ];
    const propsObj = {
      chatStore: {
        username: 'Peter',
        groupDisplayContacts: contacts,
        handleAddContact: spy
      }
    };
    const wrapper = render(propsObj);
    wrapper.find('[data-hook="contact-item"]').at(0).simulate('click');
    expect(spy).to.have.been.calledWith(contacts[1].id, contacts[1].name);
  });

  it.skip('should call handleOnRemoveTag when removing tag on contact', () => {
    const spy = sinon.spy();
    const contacts = [
      {id: '1', name: 'Peter'},
      {id: '2', name: 'Lois'},
      {id: '3', name: 'Brian'}
    ];
    const tags = [{id: '4', label: 'Stewie'}];
    const propsObj = {
      chatStore: {
        username: 'Peter',
        groupDisplayContacts: contacts,
        handleOnRemoveTag: spy,
        groupTags: tags
      }
    };
    const wrapper = render(propsObj);
    wrapper.find('[data-hook="contact-item"]').at(0).simulate('click');
    expect(spy).to.have.been.calledWith(tags[0].id);
  });

  it('should call create group when clicking on create button', () => {
    const spy = sinon.spy();
    const displayName = 'Family';
    const contacts = [
      {id: '1', name: 'Peter'},
      {id: '2', name: 'Lois'},
      {id: '3', name: 'Brian'}
    ];
    const tags = [{id: '4', label: 'Stewie'}];
    const propsObj = {
      chatStore: {
        username: 'Peter',
        groupDisplayContacts: contacts,
        createGroup: spy,
        groupTags: tags
      }
    };
    const wrapper = render(propsObj);
    inputTestkitFactory({wrapper, dataHook: 'input-group-name'}).enterText(displayName);
    buttonTestkitFactory({wrapper, dataHook: 'create-group-btn'}).click();
    expect(spy).to.have.been.calledWith(displayName);

  });
});

