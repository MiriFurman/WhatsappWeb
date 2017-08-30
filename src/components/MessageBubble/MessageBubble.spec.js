import {expect} from 'chai';
import {mount} from 'enzyme';
import React from 'react';

import MessageBubble from './MessageBubble';
import * as dh from './MessageBubbleDataHooks';

describe('Message Bubble Component', () => {
  let wrapper;

  const render = (msg = 'lol', time = '10:30 AM') => {
    wrapper = mount(<MessageBubble message={msg} time={time}/>);
  };

  it('should render', () => {
    render();
    expect(wrapper.exists()).to.be.true;
  });

  it(`should have all it's data-hooks`, () => {
    render();
    dh.dataHooks.forEach(dh => expect(wrapper.html()).to.contain(dh));
  });

  it('should take a message as a prop', () => {
    const msg = 'When I inquired in the past, you indicated that all your products are under the supervision of badatz beit yosef, and it would soon be appearing on all the packages. I see it only on one package of one type of burger. Could you please update me as to what is happening.';
    render(msg);
    expect(wrapper.html()).to.contain(msg);
  });

  it('should display unformatted time via prop provided', () => {
    const time = '13:30 PM';
    render(null, time);
    expect(wrapper.html()).to.contain(time);
  });
});
