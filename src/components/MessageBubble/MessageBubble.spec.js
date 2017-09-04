import {expect} from 'chai';
import {mount} from 'enzyme';
import React from 'react';

import MessageBubble from './MessageBubble';
import * as dh from './MessageBubbleDataHooks';
import {messageBubbleTimeFormatter} from './MessageBubbleTimeFormat';

import {textTestkitFactory} from 'wix-style-react/dist/testkit/enzyme';

describe('Message Bubble Component', () => {
  let wrapper;

  const exampleBody = 'lol';
  const exampleTime = '2017-01-23 10:30';
  const exampleId = '1a2b';
  const exampleMessage = {body: exampleBody, id: exampleId, created: exampleTime};
  const modifyExample = modification => Object.assign({}, exampleMessage, modification);

  const dhFinder = dh => wrapper.find(`[data-hook='${dh}']`);

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
    expect(dhFinder(dh.Wrapper).html()).to.contain(exampleId);
  });

  it('should take a message as a prop', () => {
    const msgBody = 'When I inquired in the past, you indicated that all your products are under the supervision of badatz beit yosef, and it would soon be appearing on all the packages. I see it only on one package of one type of burger. Could you please update me as to what is happening.';
    render(modifyExample({body: msgBody, created: exampleTime}));
    const textTestkit = textTestkitFactory({wrapper, dataHook: dh.Body});
    expect(textTestkit.getText()).to.contain(msgBody);
  });

  it('should format date correctly', () => {
    const expectedDateFormat = '10:30 AM | Jan 23, 2017';
    const created = '2017-01-23 10:30';
    const formattedCreated = messageBubbleTimeFormatter(created);
    expect(formattedCreated).to.equal(expectedDateFormat);
  });

  it('should format date correctly', () => {
    const expectedDateFormat = '02:30 PM | Jan 23, 2017';
    const created = '2017-01-23 14:30';
    const formattedCreated = messageBubbleTimeFormatter(created);
    expect(formattedCreated).to.equal(expectedDateFormat);

    const timeTestMessage = modifyExample({created});
    render(timeTestMessage);
    const textTestkit = textTestkitFactory({wrapper, dataHook: dh.Time});
    expect(textTestkit.getText()).to.equal(expectedDateFormat);
  });

  it('should put time and message on the same side', () => {
    render(exampleMessage);
    expect(dhFinder(dh.Item).html()).to.contain('fromOthers');
    expect(dhFinder(dh.Time).html()).to.contain('timeThem');
  });
});
