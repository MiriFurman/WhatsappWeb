export default class RestClient {
  constructor(axios, getUrl = str => str) {
    this.axios = axios;
    this.getUrl = getUrl;
  }

  async getContacts() {
    const {data: contacts} = await this.axios.get(this.getUrl('/api/contacts'));
    return contacts;
  }
}
