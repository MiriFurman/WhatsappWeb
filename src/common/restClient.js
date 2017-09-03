import {SEND_MESSAGE, GET_RELATIONS, GET_CONVERSATION_BY_ID, CREATE_GROUP, SIGNUP} from './endpoints';

export default class RestClient {
  constructor(axios, getUrl = str => str) {
    this.axios = axios;
    this.getUrl = getUrl;
  }

  async getContacts() {
    const url = this.getUrl('/api/contacts');
    const {data: contacts} = await this.axios.get(url);
    return contacts;
  }

  async login(user) {
    const url = this.getUrl('/api/login');
    const {data} = await this.axios.post(url, {user});
    return data;
  }

  async sendMessage(from, members, messageBody) {
    const url = this.getUrl(SEND_MESSAGE);
    const {data} = await this.axios.post(url, {from, members, messageBody});
    return data;
  }

  async getRelations(userId) {
    const url = this.getUrl(GET_RELATIONS);
    const {data} = await this.axios.get(`${url}?userId=${userId}`);
    return data;
  }

  async getConversationById(id) {
    const url = this.getUrl(GET_CONVERSATION_BY_ID);
    const {data} = await this.axios.get(`${url}?conversationId=${id}`);
    return data;
  }

  async signup(user) {
    const url = this.getUrl(SIGNUP);
    await this.axios.post(url, {user});
  }

  async createGroup(members, displayName) {
    const url = this.getUrl(CREATE_GROUP);
    const {data} = await this.axios.post(url, {members, displayName});
    return data;
  }
}
