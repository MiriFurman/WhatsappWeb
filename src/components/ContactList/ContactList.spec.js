import chai, {expect} from 'chai';
import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import ContactList from './ContactList';
chai.use(sinonChai);

describe('ContactList Component tests', () => {
  //username: PropTypes.string.isRequired,
  // contacts: PropTypes.array,
  // onContactClick: PropTypes.func.isRequired,
  const spy = sinon.spy();

  const render = props => mount(
    <ContactList
      {...props} onContactClick={spy}
                 />, {attachTo: document.createElement('div')});

  it('should render contacts on contact list', () => {
    const contacts = [
      {
        id: '8e65f3c4-d78c-4ee6-9e9d-f8cb48c77681',
        name: 'michaels@wix.com',
        imageUrl: '//www.gravatar.com/avatar/2dd3b8058e68863cf9d1aff3f581eb17'
      },
      {
        id: 'de8df4aa-12d3-4108-99d8-d718c40aa2ee',
        name: 'alice',
        imageUrl: 'https://placeimg.com/60/60/animals'
      },
      {
        id: '776b4d38-d4cd-4824-9291-27d4c5973ef4',
        name: 'nirz@wix.com',
        imageUrl: '//www.gravatar.com/avatar/48073954ed9b0f000cf7467708d73894'
      },
      {
        id: '2dad7ca4-e96b-4f51-8236-8718e7274300',
        name: 'bob',
        imageUrl: 'https://placeimg.com/60/60/animals'
      }
    ];
    const username = 'michaels@wix.com';
    const wrapper = render({username, contacts});
    expect(wrapper.find('[data-hook="contact-item"]')).to.have.lengthOf(3);
    expect(wrapper.find('[data-hook="contact-item"]').at(0).html()).to.contain(contacts[1].imageUrl);
    expect(wrapper.childAt(1).childAt(0).html()).to.contain(contacts[1].imageUrl);
    expect(wrapper.childAt(1).childAt(0).html()).to.contain(contacts[1].name);
    expect(wrapper.find('[data-hook="contact-item"]').at(1).html()).to.contain(contacts[2].imageUrl);
    expect(wrapper.childAt(1).childAt(1).html()).to.contain(contacts[2].name);
  });
});
