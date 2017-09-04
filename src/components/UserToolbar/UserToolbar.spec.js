import chai, {expect} from 'chai';
import {mount} from 'enzyme';
import React from 'react';
import {UserToolbar} from './UserToolbar';
import {textTestkitFactory, inputTestkitFactory} from 'wix-style-react/dist/testkit/enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

describe('User Toolbar component test', () => {
  const render = (props = {}) => (
    mount(
      <UserToolbar chatStore={{}} {...props}/>,
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

  it('should call filter by function on search input change', () => {
    const spy = sinon.spy();
    const searchValue = 'Winning';
    const propsObj = {
      chatStore: {
        filterBy: spy
      },
      username: 'Miri'
    };
    const wrapper = render(propsObj);
    inputTestkitFactory({wrapper, dataHook: 'search-conversation'}).enterText(searchValue);
    expect(spy).to.have.been.calledWith(searchValue);
  });
});
