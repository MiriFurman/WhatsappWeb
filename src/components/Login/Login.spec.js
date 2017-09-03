import {expect} from 'chai';
import {mount} from 'enzyme';
import React from 'react';
import Login from './Login';
import {textTestkitFactory} from 'wix-style-react/dist/testkit/enzyme';
import {testWrapper} from '../../../test/testWrappers';

describe('Login component test', () => {
  const credentialsError = 'Wrong credentials, please try again';
  const render = ({initialData}, props) => {
    return mount(
      testWrapper({initialData})(<Login {...props}/>),
      {attachTo: document.createElement('div')});
  };

  it('should render the correct heading', () => {
    const propsObj = {
      onLoginClick: () => {
      }
    };
    const heading = 'Welcome to Wazzap';
    const wrapper = render(propsObj);
    expect(textTestkitFactory({wrapper, dataHook: 'login-heading'}).getText()).to.equal(heading);
  });
  it('should render authentication failed', () => {
    const propsObj = {
      onLoginClick: () => {
      },
    };
    const initialData = {authenticationProblem: true};
    const wrapper = render({initialData}, propsObj);
    expect(textTestkitFactory({
      wrapper,
      dataHook: 'authentication-problem'
    }).getText()).to.equal(credentialsError);
  });

});
