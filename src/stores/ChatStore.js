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
  startConversation(relation) {
    this.activeRelationId = relation;
  }

  @action
  async sendMessage(from, members, messageBody) {
    await this.restClient.sendMessage(from, members, messageBody);
  }

  @action
  async getRelations(userId) {
    const relations = await this.restClient.getRelations(userId);
    this.conversations = relations.conversations;
    this.contacts = relations.contacts;
  }


}

export default ChatStore;
