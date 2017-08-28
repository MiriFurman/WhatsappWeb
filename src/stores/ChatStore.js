import {observable, action} from 'mobx';

class ChatStore {
  constructor(restClient) {
    this.restClient = restClient;
  }

  @observable username = '';
  @observable isLoggedIn = false;
  @observable contacts = [];

  @action async login(username) {
    await this.restClient.login(username);
    this.username = username;
    this.isLoggedIn = true;
    return this.getContacts();
  }

  @action async getContacts() {
    this.contacts = await this.restClient.getContacts();
  }
}

export default ChatStore;
