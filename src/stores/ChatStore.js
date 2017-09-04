import {observable, action, computed} from 'mobx';
import flatten from 'lodash/flatten';
import xor from 'lodash/xor';

export const RELATION_STATE = {
  CONTACT: 'contact',
  CONVERSATION: 'conversation'
};

const POLL_INTERVAL = 500;

class ChatStore {
  constructor(restClient, initialData = {}) {
    this.restClient = restClient;
    this.intervalId = '';
    this.isLoggedIn = initialData.isLoggedIn || this.isLoggedIn;
    this.username = initialData.username || this.username;
    this.authenticationProblem = initialData.authenticationProblem || this.authenticationProblem;
  }

  @observable username = '';
  @observable currentUser = {};
  @observable isLoggedIn = false;
  @observable contacts = [];
  @observable conversations = [];
  @observable activeRelationId = null;
  @observable activeRelationConversation = {};
  @observable relationState = '';
  @observable authenticationProblem = false;
  @observable filteredValue = '';
  @observable createGroupMode = false;
  @observable groupMembers = [];
  @observable groupTags = [];

  @computed
  get displayContacts() {
    const regularConversations = this.conversations.filter(({members}) => members.length < 3);
    const conversationsMembers = regularConversations.map(({members}) => members.toJS());
    const flattenMembers = flatten(conversationsMembers);
    const conversationUsers = flattenMembers.filter(userId => userId !== this.currentUser.id);
    const jsContacts = this.contacts.map(({id}) => id);
    const filteredContactsId = xor(conversationUsers, jsContacts);
    return this.contacts.filter(({id}) => filteredContactsId.indexOf(id) !== -1);
  }

  @computed
  get groupDisplayContacts() {
    const allContacts = this.contacts.map(({id}) => id);
    const filteredContactsId = xor(this.groupMembers, allContacts);
    return this.contacts.filter(({id}) => filteredContactsId.indexOf(id) !== -1);
  }

  @computed
  get filteredVal() {
    return this.filteredValue;
  }

  @computed
  get conversationDisplayName() {
    const conversationId = this.activeRelationConversation.id;
    const currConv = this.conversations.find(conv => conv.id === conversationId);
    return currConv ? currConv.displayName : '';
  }

  @action
  async login(user) {
    const currentUser = await this.restClient.login(user);
    if (currentUser) {
      this.username = currentUser.name;
      this.isLoggedIn = true;
      this.currentUser = currentUser;
      await this.getRelations(currentUser.id);
      return currentUser;
    } else {
      this.authenticationProblem = true;
    }
  }

  @action
  async getContacts() {
    this.contacts = await this.restClient.getContacts();
  }

  @action
  async startConversation(relation, newConversation = true) {
    this.activeRelationId = relation;
    if (!newConversation) {
      this.relationState = RELATION_STATE.CONVERSATION;
      await this.getConversationById(relation);
    } else {
      this.activeRelationConversation = {};
      this.relationState = RELATION_STATE.CONTACT;
    }
  }

  @action
  async sendMessage(from, members, messageBody) {
    const conversationId = await this.restClient.sendMessage(from, members, messageBody);
    await this.getConversationById(conversationId);
    this.activeRelationId = conversationId;
    this.relationState = RELATION_STATE.CONVERSATION;
  }

  @action
  async getRelations(userId) {
    const relations = await this.restClient.getRelations(userId);
    this.conversations = relations.conversations;
    this.contacts = relations.contacts;
  }

  @action
  async getConversationById(id) {
    const conversation = await this.restClient.getConversationById(id);
    this.activeRelationConversation = conversation;
  }

  @action
  async dataPolling() {
    this.intervalId = setInterval(() => {
      if (this.currentUser) {
        this.getRelations(this.currentUser.id);
      }
      if (this.activeRelationId && this.relationState === RELATION_STATE.CONVERSATION) {
        this.getConversationById(this.activeRelationConversation.id);
      }
    }, POLL_INTERVAL);
  }

  @action
  filterBy(val) {
    this.filteredValue = val;
  }

  @action
  async createGroup(displayName) {
    if (displayName !== '') {
      const members = [...this.groupMembers, this.currentUser.id];
      const conversationId = await this.restClient.createGroup(members, displayName);
      await this.getConversationById(conversationId);
      this.activeRelationId = conversationId;
      this.relationState = RELATION_STATE.CONVERSATION;
      this.groupMembers = [];
      this.groupTags = [];
    }
  }

  @action
  showCreateGroup() {
    this.createGroupMode = true;
  }

  @action
  hideCreateGroup() {
    this.createGroupMode = false;
  }

  @action
  handleOnRemoveTag(tagId) {
    this.groupTags = this.groupTags.filter(currTag => currTag.id !== tagId);
    this.groupMembers = this.groupMembers.filter(currMember => currMember !== tagId);
  }

  @action
  handleAddContact(contactId, contactName) {
    this.groupTags = [...this.groupTags, {id: contactId, label: contactName}];
    this.groupMembers = [...this.groupMembers, contactId];
  }

  signup(user) {
    this.authenticationProblem = false;
    return this.restClient.signup(user);
  }
}

export default ChatStore;
