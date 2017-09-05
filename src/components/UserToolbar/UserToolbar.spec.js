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

  it('should display the correct gravatar', () => {
    const fakeImgUrl = 'imgur.com/a';
    const realProps = {
      chatStore: {
        restClient: {},
        intervalId: 82,
        username: 'alice',
        getUsernameByUserId: () => 'a',
        currentUser: {
          name: 'alice',
          id: '228d35f8-482b-40c5-939b-773258f6c5e3'
        },
        isLoggedIn: true,
        contacts: [{
          id: '228d35f8-482b-40c5-939b-773258f6c5e3',
          name: 'alice',
          imageUrl: fakeImgUrl
        }, {
          id: '31f01487-8a7c-47b1-bfae-8d3596612a17',
          name: 'bob',
          imageUrl: 'imgur.com/b'
        }],
        conversations: [{
          id: 'cd146d47-4fce-4b76-9ae5-7ac90463af74',
          members: ['31f01487-8a7c-47b1-bfae-8d3596612a17', '228d35f8-482b-40c5-939b-773258f6c5e3'],
          displayName: 'bob'
        }],
        activeRelationId: 'cd146d47-4fce-4b76-9ae5-7ac90463af74',
        activeRelationConversation: {
          id: 'cd146d47-4fce-4b76-9ae5-7ac90463af74',
          members: ['31f01487-8a7c-47b1-bfae-8d3596612a17', '228d35f8-482b-40c5-939b-773258f6c5e3'],
          messages: [{
            id: 'e1e7f168-e919-4489-ae11-4470f6ec08a8',
            body: 'hi im bob',
            conversationId: 'cd146d47-4fce-4b76-9ae5-7ac90463af74',
            created: '2017-09-03T07:51:08.740Z',
            createdBy: '31f01487-8a7c-47b1-bfae-8d3596612a17'
          }, {
            id: 'd505db34-85e9-4bf4-8875-6eab46d4a1ed',
            body: 'hi im alice',
            conversationId: 'cd146d47-4fce-4b76-9ae5-7ac90463af74',
            created: '2017-09-03T07:51:18.825Z',
            createdBy: '228d35f8-482b-40c5-939b-773258f6c5e3'
          }]
        },
        relationState: 'conversation'
      },
      username: 'alice'
    };
    const propsObj = {
      chatStore: {
        contacts: [{
          id: '1a2b',
          name: 'michaels@wix.com',
          imageUrl: fakeImgUrl
        }]
      },
      username: 'michaels@wix.com',
      currentUser: {id: '1a2b'}
    };
    const wrapper = render(realProps);
    expect(wrapper.find('[data-hook="toolbar-gravatar"]').html()).to.contain(fakeImgUrl);
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
