import {expect} from 'chai';
import {mount} from 'enzyme';
import React from 'react';

import MessageBubble from './MessageBubble';
import * as dh from './MessageBubbleDataHooks';

describe('Message Bubble Component', () => {
  let wrapper;

  const exampleBody = 'lol';
  const exampleTime = '10:30 AM';
  const exampleId = '1a2b';
  const exampleMessage = {body: exampleBody, id: exampleId, created: exampleTime};
  const modifyExample = modification => Object.assign({}, exampleMessage, modification);

  const bubbleFinder = () => wrapper.find(`[data-hook='${dh.Item}']`);

  const render = props => {
    wrapper = mount(<MessageBubble {...props}/>);
  };

  it('should render', () => {
    render(exampleMessage);
    expect(wrapper.exists()).to.be.true;
  });

  it(`should have all it's data-hooks`, () => {
    render(exampleMessage);
    dh.dataHooks.forEach(dh => expect(wrapper.html()).to.contain(dh));
  });

  it('should store message id as attribute', () => {
    render(exampleMessage);
    expect(bubbleFinder().html()).to.contain(exampleId);
  });

  it('should take a message as a prop', () => {
    const msgBody = 'When I inquired in the past, you indicated that all your products are under the supervision of badatz beit yosef, and it would soon be appearing on all the packages. I see it only on one package of one type of burger. Could you please update me as to what is happening.';
    render(modifyExample({body: msgBody}));
    expect(wrapper.find(`[data-hook='${dh.Body}']`).text()).to.equal(msgBody);
  });

  it('should display unformatted time via prop provided', () => {
    const created = '13:30 PM';
    const timeTestMessage = modifyExample({created});
    render(timeTestMessage);
    expect(wrapper.html()).to.contain(created);
  });
});
