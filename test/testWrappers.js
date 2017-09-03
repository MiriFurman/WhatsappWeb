import React from 'react';
import {Router} from 'react-router';
import {Provider} from 'mobx-react';
import {configureStores} from '../src/stores/configureStores';
import createMemoryHistory from 'history/createMemoryHistory';

export const testWrapper = ({initialData = {}, routerHistory = createMemoryHistory()} = {}) => {
  return Component => (
    <Provider {...configureStores({initialData})}>
      <Router history={routerHistory}>
        {Component}
      </Router>
    </Provider>
  );
};
