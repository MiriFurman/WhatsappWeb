import {expect} from 'chai';
import {mount} from 'enzyme';
import React from 'react';

import Welcome from './index';

describe('Welcome Component', () => {
  let wrapper;

  const dataHook = hook => `data-hook="${hook}"`;
  const welcomeDataHook = dataHook('welcome-screen');
  const welcomeTextDataHook = dataHook('welcome-text');

  const render = () => {
    wrapper = mount(<Welcome/>);
  };

  it('should render', () => {
    render();
    expect(wrapper.exists()).to.be.true;
  });

  it(`should have data-hooks`, () => {
    render();
    expect(wrapper.html()).to.contain(welcomeDataHook);
    expect(wrapper.html()).to.contain(welcomeTextDataHook);
  });

  it(`should contain welcome message`, () => {
    render();
    expect(wrapper.html()).to.contain('Welcome to Wazzappppp');
  });

  it(`should contain a logo image`, () => {
    render();
    expect(wrapper.find('img').first().exists()).to.be.true;
  });
});
