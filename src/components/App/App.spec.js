import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';
import App from './App';
import createMemoryHistory from 'history/createMemoryHistory';
import {testWrapper} from '../../../test/testWrappers';

describe('App integration tests', () => {
  let history, wrapper;

  beforeEach(() => {
    history = createMemoryHistory();
  });
  afterEach(() => {
    wrapper.detach();
  });

  const render = ({initialData} = {}) => {
    return mount(
      testWrapper({initialData, routerHistory: history})(<App/>),
      {attachTo: document.createElement('div')});
  };

  it('should render login', () => {
    const propObj = {
      username: 'dany',
      isLoggedIn: false
    };
    wrapper = render({initialData: propObj});
    expect(wrapper.find('[data-hook="login-screen"]').exists()).to.equal(true);
  });

  it('should render chat component', () => {
    wrapper = render({initialData: {username: 'b', isLoggedIn: true}});
    expect(wrapper.find('[data-hook="login-screen"]').exists()).to.equal(false);
    expect(history.location.pathname).to.equal('/chat');
  });

  it('should render signup', () => {
    const propObj = {
      username: 'a',
      isLoggedIn: false
    };
    wrapper = render({chatStore: propObj});
    wrapper.find('[data-hook="signup-link"]').simulate('click', {button: 0});
    expect(history.location.pathname).to.equal('/signup');
  });

  it('should redirect to login when isLoggedIn false', () => {
    const propObj = {
      username: 'a',
      isLoggedIn: false
    };
    wrapper = render({initialData: propObj});
    history.push('/chat');
    expect(history.location.pathname).to.equal('/login');
  });

  it('should redirect to chat from signup on loggedIn', () => {
    wrapper = render({initialData: {username: 'b', isLoggedIn: true}});
    history.push('/signup');
    expect(history.location.pathname).to.equal('/chat');
  });
});
