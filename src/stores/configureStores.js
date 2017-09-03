import RestClient from '../common/restClient';
import ChatStore from './ChatStore';

export function configureStores({initialData, axios} = {}) {
  const restClient = new RestClient(axios);
  const chatStore = new ChatStore(restClient, initialData);
  return {chatStore};
}
