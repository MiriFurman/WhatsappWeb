import chai, {expect} from 'chai';
import {mount} from 'enzyme';
import React from 'react';
import ConversationWindow from './ConversationWindow';
import {textTestkitFactory} from 'wix-style-react/dist/testkit/enzyme';
import ChatStore from '../../stores/ChatStore';
import RestClient from '../../common/restClient';
import {baseURL} from '../../../test/test-common';
import axios from 'axios';
import nock from 'nock';
import * as endpoints from '../../common/endpoints';
import * as dh from '../MessageBubble/MessageBubbleDataHooks';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

window.webkitSpeechRecognition = () => ({
  start: () => {
  },
  stop: () => {
  }
});
describe('Conversation window component test', () => {
  const render = (props = {}) => (
    mount(
      <ConversationWindow
        onSendMessage={() => {
        }} {...props}
           />,
      {attachTo: document.createElement('div')}
    )
  );

  it('should render the correct conversation display name', () => {
    const propsObj = {
      chatStore: {
        activeRelationConversation: {members: ['111', '222']},
        conversationDisplayName: 'Miri'
      }
    };
    const wrapper = render(propsObj);
    expect(textTestkitFactory({
      wrapper,
      dataHook: 'conversation-window-display-name'
    }).getText()).to.equal(propsObj.chatStore.conversationDisplayName);
  });

  it('should render the correct conversation messages', () => {
    const msg1 = 'bend the knee';
    const msg2 = 'you know nothing';
    const propsObj = {
      chatStore: {
        currentUser: {id: 4},
        getUsernameByUserId: () => 'a',
        activeRelationConversation: {
          members: ['111', '222'],
          messages: [
            {
              id: '111',
              body: msg1,
              created: '2017-08-29T13:47:37.295Z'
            },
            {
              id: '222',
              body: msg2,
              created: '2017-08-29T14:47:37.295Z'
            }
          ]
        }
      }
    };
    const wrapper = render(propsObj);
    let textTestkit = textTestkitFactory({wrapper: wrapper.find('[data-hook="msg-item"]').at(0), dataHook: dh.Body});
    expect(textTestkit.getText()).to.equal(msg1);
    textTestkit = textTestkitFactory({wrapper: wrapper.find('[data-hook="msg-item"]').at(1), dataHook: dh.Body});
    expect(textTestkit.getText()).to.equal(msg2);
  });

  it('should call onSendMessage function when message is not empty and enter pressed', () => {
    const spy = sinon.spy();
    const msg = 'bend the knee';
    const propsObj = {
      onSendMessage: spy,
      chatStore: {
        activeRelationConversation: {},
        conversationDisplayName: 'Jon',
        messages: []
      }
    };
    const wrapper = render(propsObj);
    const msgInput = wrapper.find('[data-hook="input-msg"]');
    msgInput.simulate('change', {target: {value: msg}});
    msgInput.simulate('keyPress', {keyCode: 13, key: 'Enter'});
    expect(spy).to.have.been.calledWith(msg);
  });

  it('should render as a group chat', () => {
    const userGenerator = (name, uindx) => ({id: uindx, name});
    const users = ['alice', 'bob', 'charles'].map((username, uindx) => userGenerator(username, uindx.toString()));
    const getUsernameByUserId = id => users.find(user => user.id === id);
    const propsObj2 = {
      chatStore: {
        restClient: {},
        getUsernameByUserId,
        intervalId: 96,
        username: 'bob',
        currentUser: {
          name: 'bob',
          password: 'b',
          id: '1'
        },
        isLoggedIn: true,
        contacts: [{
          id: '0',
          name: 'alice',
          imageUrl: 'imgur.com/a'
        }, {
          id: '1',
          name: 'bob',
          imageUrl: 'imgur.com/b'
        }, {
          id: '2',
          name: 'charles',
          imageUrl: 'imgur.com/c'
        }],
        conversations: [{
          id: '05a9e0ae-f8b4-4e96-8e42-638a73d246e3',
          members: ['0', '1', '2'],
          displayName: 'abc'
        }],
        activeRelationId: '05a9e0ae-f8b4-4e96-8e42-638a73d246e3',
        activeRelationConversation: {
          id: '05a9e0ae-f8b4-4e96-8e42-638a73d246e3',
          members: ['0', '1', '2'],
          messages: [{
            id: '451fed53-788f-4c97-9cd2-7cd64f59a825',
            body: 'hi its c',
            conversationId: '05a9e0ae-f8b4-4e96-8e42-638a73d246e3',
            created: '2017-09-04T14:09:58.688Z',
            createdBy: '2'
          }, {
            id: 'f5b17647-a06b-41a9-b427-859bb6a35f99',
            body: 'hi, it\'s alice',
            conversationId: '05a9e0ae-f8b4-4e96-8e42-638a73d246e3',
            created: '2017-09-04T14:10:15.831Z',
            createdBy: '0'
          }, {
            id: 'e2203a6e-a0e1-4fc3-b60e-0fdc831b9a9b',
            body: 'hi, it\'s bob and i\'m current user',
            conversationId: '05a9e0ae-f8b4-4e96-8e42-638a73d246e3',
            created: '2017-09-04T14:10:32.978Z',
            createdBy: '1'
          }],
          displayName: 'abc'
        },
        relationState: 'conversation',
        authenticationProblem: false,
        filteredValue: '',
        createGroupMode: false,
        groupMembers: [],
        groupTags: []
      }
    };
    const wrapper = render(propsObj2);
    expect(wrapper.find('[data-hook="msg-item"]').length).to.have.at.least(3, `missing group messages`);
    expect(wrapper.find(`[data-hook="${dh.Time}"]`).at(0).text()).to.include(users[2].name);
    expect(wrapper.find(`[data-hook="${dh.Time}"]`).at(1).text()).to.include(users[0].name);
    expect(wrapper.find(`[data-hook="${dh.Time}"]`).at(2).text()).to.include(users[1].name);
  });

  it('should render as a group chat', () => {
    const userGenerator = (name, uindx) => ({id: uindx, name});
    const users = ['alice', 'bob', 'charles'].map((username, uindx) => userGenerator(username, uindx.toString()));
    const getUsernameByUserId = id => users.find(user => user.id === id);
    const propsObj2 = {
      chatStore: {
        restClient: {},
        getUsernameByUserId,
        intervalId: 96,
        username: 'bob',
        currentUser: {
          name: 'bob',
          password: 'b',
          id: '1'
        },
        isLoggedIn: true,
        contacts: [{
          id: '0',
          name: 'alice',
          imageUrl: 'imgur.com/a'
        }, {
          id: '1',
          name: 'bob',
          imageUrl: 'imgur.com/b'
        }],
        conversations: [{
          id: '05a9e0ae-f8b4-4e96-8e42-638a73d246e3',
          members: ['0', '1'],
          displayName: 'abc'
        }],
        activeRelationId: '05a9e0ae-f8b4-4e96-8e42-638a73d246e3',
        activeRelationConversation: {
          id: '05a9e0ae-f8b4-4e96-8e42-638a73d246e3',
          members: ['0', '1'],
          messages: [{
            id: 'f5b17647-a06b-41a9-b427-859bb6a35f99',
            body: 'hi, it\'s alice',
            conversationId: '05a9e0ae-f8b4-4e96-8e42-638a73d246e3',
            created: '2017-09-04T14:10:15.831Z',
            createdBy: '0'
          }, {
            id: 'e2203a6e-a0e1-4fc3-b60e-0fdc831b9a9b',
            body: 'hi, it\'s bob and i\'m current user',
            conversationId: '05a9e0ae-f8b4-4e96-8e42-638a73d246e3',
            created: '2017-09-04T14:10:32.978Z',
            createdBy: '1'
          }],
          displayName: 'abc'
        },
        relationState: 'conversation',
        authenticationProblem: false,
        filteredValue: '',
        createGroupMode: false,
        groupMembers: [],
        groupTags: []
      }
    };
    const wrapper = render(propsObj2);
    expect(wrapper.find('[data-hook="gravatar-image"]').html()).to.contain('src="imgur.com/b"');
  });
});


describe('Conversation Window', () => {
  let wrapper;

  const restClient = new RestClient(axios, url => `${baseURL}${url}`);
  const testChatStore = new ChatStore(restClient);

  const render = (props = {}) => {
    wrapper = mount(<ConversationWindow
      onSendMessage={() => {
      }} chatStore={testChatStore} {...props}
                                   />);
  };

  it('should render one chat message', async () => {
    render();
    const generatedResponse = {
      id: '39d2a309-4430-4850-883a-0e22a03ad06d',
      members: ['a65bd338-aba1-42e9-ae2b-322b090e069e',
        'a98fb470-f2ec-45fd-b56c-1fecca7bda92'],
      messages: [{
        id: 'd0cca645-d462-477e-8c1b-9a39226cf408',
        body: 'Bend the knee',
        conversationId: '39d2a309-4430-4850-883a-0e22a03ad06d',
        created: '2017-08-29T13:47:37.295Z',
        createdBy: 'a65bd338-aba1-42e9-ae2b-322b090e069e'
      }]
    };
    const {id} = generatedResponse;
    nock(baseURL).get(`${endpoints.GET_CONVERSATION_BY_ID}?conversationId=${id}`)
      .reply(200, generatedResponse);
    await testChatStore.getConversationById(id);
    const textTestkit = textTestkitFactory({wrapper, dataHook: dh.Body});
    expect(textTestkit.getText()).to.equal(generatedResponse.messages[0].body);
  });

  it('should render multiple chat messages', async () => {
    render();
    const generatedResponse = {
      id: '39d2a309-4430-4850-883a-0e22a03ad06d',
      members: ['a65bd338-aba1-42e9-ae2b-322b090e069e',
        'a98fb470-f2ec-45fd-b56c-1fecca7bda92'],
      messages: [{
        id: 'd0cca645-d462-477e-8c1b-9a39226cf408',
        body: 'Bend the knee',
        conversationId: '39d2a309-4430-4850-883a-0e22a03ad06d',
        created: '2017-08-29T13:47:37.295Z',
        createdBy: 'a65bd338-aba1-42e9-ae2b-322b090e069e'
      },
      {
        id: 'b',
        body: '!Bend the knee!',
        conversationId: 'b',
        created: '2017-08-29T14:47:37.295Z',
        createdBy: 'a65bd338-aba1-42e9-ae2b-322b090e069e'
      }]
    };
    const {id} = generatedResponse;
    nock(baseURL).get(`${endpoints.GET_CONVERSATION_BY_ID}?conversationId=${id}`)
      .reply(200, generatedResponse);
    await testChatStore.getConversationById(id);
    const message2 = generatedResponse.messages[1];
    expect(wrapper.find(`[data-message-id='${message2.conversationId}']`).text()).to.contain(message2.body);
  });

  it('should return true if currentUser sent a message', () => {
    const currentUser = {id: 'c568a24a-6678-4c8e-9db7-3e305ebf4e71', name: 'dany'};
    const otherUser = {id: '03c293b1-6a8e-466f-bfa3-eff133ba63d7', name: 'jon'};
    const message1 = {
      id: 'e1cca645-d462-477e-8c1b-9a39226cf408',
      body: 'Bend the knee',
      conversationId: '39d2a309-4430-4850-883a-0e22a03ad06d',
      created: '2017-08-29T13:47:37.295Z',
      createdBy: currentUser.id
    };
    const message2 = {
      id: 'd0cca645-d462-477e-8c1b-9a39226cf408',
      body: 'Yes my love',
      conversationId: '39d2a309-4430-4850-883a-0e22a03ad06d',
      created: '2017-08-29T14:47:37.295Z',
      createdBy: otherUser.id
    };

    const chatStore = {
      currentUser,
      getUsernameByUserId: () => 'a',
      activeRelationConversation: {
        members: [currentUser, otherUser],
        messages: [
          message1,
          message2
        ]
      }
    }
    ;
    wrapper = mount(<ConversationWindow
      onSendMessage={() => {
      }} chatStore={chatStore}
         />);

    expect(wrapper.find(`.messageBubbleWrapper`).length).to.equal(2);
    expect(wrapper.find(`.messageBubbleWrapper`).first().html()).to.contain('fromMe');
    expect(wrapper.find(`.messageBubbleWrapper`).last().html()).to.contain('fromOthers');
  });

  it('should inform bubble if message from me or another user', () => {
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
          imageUrl: 'imgur.com/a'
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
      }
    };
    wrapper = mount(<ConversationWindow
      onSendMessage={() => {
      }} {...realProps}
         />);

    expect(wrapper.find(`.messageBubbleWrapper`).last().html()).to.contain('fromMe');
    expect(wrapper.find(`.messageBubbleWrapper`).first().html()).to.contain('fromOthers');
  });
});

