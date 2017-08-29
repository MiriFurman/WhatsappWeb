import {observable, action} from 'mobx';

class ChatStore {
  constructor(restClient) {
    this.restClient = restClient;
  }

  @observable username = '';
  @observable currentUser = {};
  @observable isLoggedIn = false;
  @observable contacts = [];
  @observable conversations = [];
  @observable activeRelationId = null;
  @observable activeRelationConversation = {};

  @action
  async login(username) {
    const currentUser = await this.restClient.login(username);
    this.username = username;
    this.isLoggedIn = true;
    this.currentUser = currentUser;
    return this.getRelations(currentUser.id);
  }

  @action
  async getContacts() {
    this.contacts = await this.restClient.getContacts();
  }

  @action
  async startConversation(relation, newConversation = true) {
    this.activeRelationId = relation;
    if (!newConversation) {
      await this.getConversationById(relation);
    }
  }

  @action
  async sendMessage(from, members, messageBody) {
    const conversationId = await this.restClient.sendMessage(from, members, messageBody);
    await this.getConversationById(conversationId);
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
}

export default ChatStore;
