import {expect} from 'chai';
import {mount} from 'enzyme';
import React from 'react';
import Login from './Login';
import {textTestkitFactory} from 'wix-style-react/dist/testkit/enzyme';

describe('Login component test', () => {
  const render = (props = {}) => (
    mount(
      <Login {...props}/>,
      {attachTo: document.createElement('div')}
    )
  );

  it('should render the correct heading', () => {
    const propsObj = {
      onLoginClick: () => {}
    };
    const heading = 'Welcome to Wazzap';
    const wrapper = render(propsObj);
    expect(textTestkitFactory({wrapper, dataHook: 'login-heading'}).getText()).to.equal(heading);
  });
});
