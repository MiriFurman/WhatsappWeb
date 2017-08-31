import {expect} from 'chai';
import {mount} from 'enzyme';
import React from 'react';
import UserToolbar from './UserToolbar';
import {textTestkitFactory} from 'wix-style-react/dist/testkit/enzyme';

describe('User Toolbar component test', () => {
  const render = (props = {}) => (
    mount(
      <UserToolbar {...props}/>,
      {attachTo: document.createElement('div')}
    )
  );

  it('should render the correct user name', () => {
    const propsObj = {
      username: 'Miri'
    };
    const wrapper = render(propsObj);
    expect(textTestkitFactory({wrapper, dataHook: 'username'}).getText()).to.equal(propsObj.username);
  });
});
