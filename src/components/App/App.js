import React from 'react';
import PropTypes from 'prop-types';
import Input from 'wix-style-react/dist/src/Input';

import s from './App.scss';

function App() {
  return (
    <div className={s.root}>
      <div>
        <Input dataHook="login-username"/>
      </div>
    </div>
  );
}

App.propTypes = {
  t: PropTypes.func
};

export default App;
