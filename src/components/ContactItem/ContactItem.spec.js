import {expect} from 'chai';
import sinon from 'sinon';
import {mount} from 'enzyme';
import React from 'react';
import ContactItem from './ContactItem';
import {textTestkitFactory} from 'wix-style-react/dist/testkit/enzyme';

describe('ContactItem component tests', () => {
  const render = (props = {}) => (
    mount(
      <ContactItem {...props}/>,
      {attachTo: document.createElement('div')}
    )
  );
  it('should render contact item properly', () => {
    const propObject = {
      name: 'Shilo Mangam',
      imageUrl: 'https://placebear.com/40/40',
      onContactClick: () => {}
    };
    const wrapper = render(propObject);
    expect(textTestkitFactory({wrapper, dataHook: 'contact-display-name'}).getText()).to.equal(propObject.name);
    expect(wrapper.find('[data-hook="contact-img"]').prop('src')).to.equal(propObject.imageUrl);
  });
  it('should render empty image when no image provided', () => {
    const propObject = {
      name: 'Shilo Mangam',
      imageUrl: '',
      onContactClick: () => {}
    };
    const wrapper = render(propObject);
    expect(wrapper.find('[data-hook="contact-img"]').prop('src')).to.equal('no-image.png');
  });
  it('should invoke start conversation on relation click', () => {
    const spy = sinon.spy();
    const propObject = {
      id: '1',
      name: 'Shilo Mangam',
      imageUrl: 'https://placebear.com/40/40',
      onContactClick: spy
    };
    const wrapper = render(propObject);
    wrapper.find('[data-hook="contact-item"]').at(0).simulate('click');
    expect(spy.getCall(0).args).to.eql([propObject.id, propObject.name]);
  });

});
