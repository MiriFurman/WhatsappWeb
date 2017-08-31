import {expect} from 'chai';
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
});

