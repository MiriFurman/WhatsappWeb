import {expect} from 'chai';
import {mount} from 'enzyme';
import React from 'react';
import Signup from './Signup';
import {
  textTestkitFactory,
  buttonTestkitFactory,
  inputTestkitFactory
} from 'wix-style-react/dist/testkit/enzyme';
import {StaticRouter as Router} from 'react-router';
import sinon from 'sinon';

describe('Signup component test', () => {
  const render = (props = {}) => (
    mount(
      <Router context={{}}>
        <Signup {...props}/>
      </Router>
      ,
      {attachTo: document.createElement('div')}
    )
  );

  it('should render the correct heading', () => {
    const propsObj = {
      onSignupClick: () => {
      }
    };
    const heading = 'Welcome to Wazzap';
    const wrapper = render(propsObj);
    expect(textTestkitFactory({wrapper, dataHook: 'signup-heading'}).getText()).to.equal(heading);
  });

  it('should invoke signup function on click on signup', () => {
    const userObj = {username: 'Shlomi', password: 'TS'};
    const spy = sinon.spy();
    const propsObj = {
      onSignupClick: spy,
    };
    const wrapper = render(propsObj);
    inputTestkitFactory({wrapper, dataHook: 'signup-username'}).enterText(userObj.username);
    inputTestkitFactory({wrapper, dataHook: 'signup-password'}).enterText(userObj.password);
    inputTestkitFactory({wrapper, dataHook: 'signup-verify-password'}).enterText(userObj.password);
    const signupBtn = buttonTestkitFactory({wrapper, dataHook: 'signup-btn'});
    signupBtn.click();
    expect(spy.getCall(0).args).to.eql([userObj.username, userObj.password]);
  });

});
