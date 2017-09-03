import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';
import {App} from './App';
import {Router} from 'react-router';
import createMemoryHistory from 'history/createMemoryHistory';


describe('App integration tests', () => {
  let history, wrapper;
  const AppWithRouter = (props = {}) => (
    <Router {...props} history={history}>
      <App {...props}/>
    </Router>
  );
  beforeEach(() => {
    history = createMemoryHistory();
  });
  afterEach(() => {
    wrapper.detach();
  });
  const render = (props = {}) => mount(
    <AppWithRouter {...props}/>, {attachTo: document.createElement('div')});

  it('should render login', () => {
    const propObj = {
      username: 'dany',
      isLoggedIn: false
    };
    wrapper = render({chatStore: propObj});
    expect(wrapper.find('[data-hook="login-screen"]').exists()).to.equal(true);
  });

  it('should render chat component', () => {
    const propObj = {
      username: 'a',
      isLoggedIn: false
    };
    wrapper = render({chatStore: propObj});
    wrapper.setProps({chatStore: {username: 'b', isLoggedIn: true}});
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
    wrapper = render({chatStore: propObj});
    history.push('/chat');
    wrapper.setProps({initialEntries: ['/chat'], initialIndex: 0});
    expect(history.location.pathname).to.equal('/login');
  });
  it('should redirect to chat from signup on loggedIn', () => {
    const propObj = {
      username: 'a',
      isLoggedIn: false
    };
    wrapper = render({chatStore: propObj});
    history.push('/signup');
    wrapper.setProps({chatStore: {username: 'b', isLoggedIn: true}});
    expect(history.location.pathname).to.equal('/chat');
  });

});
