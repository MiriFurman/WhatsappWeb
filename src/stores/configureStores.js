/**
 * Created by mirif on 29/08/2017.
 */
import RestClient from '../common/restClient';
import ChatStore from './ChatStore';

export function configureStores(axios) {
  const restClient = new RestClient(axios);
  const chatStore = new ChatStore(restClient);
  return {chatStore};
}
