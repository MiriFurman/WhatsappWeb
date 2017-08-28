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
    const {status} = await this.axios.post(url, {username});
    return status;
  }
}
