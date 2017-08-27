import React from 'react';
import PropTypes from 'prop-types';
import Input from 'wix-style-react/dist/src/Input';
import Button from 'wix-style-react/dist/src/Button';

import s from './App.scss';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      username: null,
      isLoggedIn: false
    };
  }

  render() {
    const {username, isLoggedIn} = this.state;
    return (
      <div className={s.root}>
        <div>
          <Input dataHook="login-username" onChange={evt => this.setState({username: evt.target.value})}/>
          <Button dataHook="login-btn" onClick={() => this.setState({isLoggedIn: true})}/>
          {isLoggedIn && <div data-hook="username">{username}</div>}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  t: PropTypes.func
};

export default App;
