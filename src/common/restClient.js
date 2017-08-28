import {SEND_MESSAGE, GET_RELATIONS} from './endpoints';

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

  async login(username) {
    const url = this.getUrl('/api/login');
    const {data} = await this.axios.post(url, {username});
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
}
