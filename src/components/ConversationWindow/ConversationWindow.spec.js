import chai, {expect} from 'chai';
import {mount} from 'enzyme';
import React from 'react';
import ConversationWindow from './ConversationWindow';
import {textTestkitFactory, inputTestkitFactory} from 'wix-style-react/dist/testkit/enzyme';
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


describe('Conversation window component test', () => {
  const render = (props = {}) => (
    mount(
      <ConversationWindow onSendMessage={() => {}} {...props}/>,
      {attachTo: document.createElement('div')}
    )
  );

  it('should render the correct conversation display name', () => {
    const propsObj = {
      chatStore: {
        activeRelationConversation: {},
        conversationDisplayName: 'Miri'
      }
    };
    const wrapper = render(propsObj);
    expect(textTestkitFactory({wrapper, dataHook: 'conversation-window-display-name'}).getText()).to.equal(propsObj.chatStore.conversationDisplayName);
  });

  it('should render the correct conversation messages', () => {
    const msg1 = 'bend the knee';
    const msg2 = 'you know nothing';
    const propsObj = {
      chatStore: {
        currentUser: {id: 4},
        activeRelationConversation: {
          messages: [
            {
              id: '111',
              body: msg1
            },
            {
              id: '222',
              body: msg2
            }
          ]
        }
      }
    };
    const wrapper = render(propsObj);
    expect(wrapper.find('[data-hook="msg-item"]').map(item => item.text())).to.eql([msg1, msg2]);
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
    const dataHook = 'input-msg';
    const testkit = inputTestkitFactory({wrapper, dataHook});
    testkit.enterText(msg);
    testkit.trigger('keyDown', {keyCode: 13});
    expect(spy).to.have.been.calledWith(msg);
  });

});


describe('Conversation Window', () => {
  let wrapper;

  const restClient = new RestClient(axios, url => `${baseURL}${url}`);
  const testChatStore = new ChatStore(restClient);

  const render = props => {
    wrapper = mount(<ConversationWindow chatStore={testChatStore} {...props}/>);
  };

  it('should render', () => {
    render();
    expect(wrapper.exists()).to.be.true;
  });

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
    expect(wrapper.find(`[data-hook='${dh.Body}']`).text()).to.equal(generatedResponse.messages[0].body);
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
      activeRelationConversation: {
        messages: [
          message1,
          message2
        ]
      }
    }
    ;
    wrapper = mount(<ConversationWindow chatStore={chatStore}/>);

    expect(wrapper.find(`.messageBubbleWrapper`).length).to.equal(2);
    expect(wrapper.find(`.messageBubbleWrapper`).first().html()).to.contain('fromMe');
    expect(wrapper.find(`.messageBubbleWrapper`).last().html()).to.contain('fromOthers');
  });

  // testing the network reply; going to test the props instead
  it.skip('should format message bubble from server reply', () => {
    const currentUser = '744d0635-98bd-4a63-b580-da47f00aaa44';
    // const otherUser = '342dbdee-c4ea-4213-bc69-04eb4371ceaa';

    const chatStore = {
      currentUser,
      activeRelationConversation: {
        messages: [{id: '319f59ca-4ec0-4767-868e-769c93a34d85', body: 'i\'m bob', conversationId: 'b78eb590-8c8f-45cb-8c16-c695fcef0469', created: '2017-09-03T07:40:12.957Z', createdBy: '744d0635-98bd-4a63-b580-da47f00aaa44'}, {id: 'f82f7efd-56a0-421e-a9e5-f3acb035e637', body: 'i\'m alice', conversationId: 'b78eb590-8c8f-45cb-8c16-c695fcef0469', created: '2017-09-03T07:40:23.855Z', createdBy: '342dbdee-c4ea-4213-bc69-04eb4371ceaa'}]
      }
    };

    wrapper = mount(<ConversationWindow chatStore={chatStore}/>);

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
        currentUser: {
          name: 'alice',
          id: '228d35f8-482b-40c5-939b-773258f6c5e3'
        },
        isLoggedIn: true,
        contacts: [{
          id: '228d35f8-482b-40c5-939b-773258f6c5e3',
          name: 'alice'
        }, {
          id: '31f01487-8a7c-47b1-bfae-8d3596612a17',
          name: 'bob'
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

    wrapper = mount(<ConversationWindow {...realProps}/>);

    expect(wrapper.find(`.messageBubbleWrapper`).last().html()).to.contain('fromMe');
    expect(wrapper.find(`.messageBubbleWrapper`).first().html()).to.contain('fromOthers');
  });
});

