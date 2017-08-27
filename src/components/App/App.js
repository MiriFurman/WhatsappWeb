import React from 'react';
import PropTypes from 'prop-types';
import Login from '../Login';
import ChatView from '../ChatView';
import s from './App.scss';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      userName: null,
      isLoggedIn: false
    };
  }

  render() {
    const {userName, isLoggedIn} = this.state;
    return (
      <div className={s.root}>
        {!isLoggedIn && <Login onLoginClick={userName => this.setState({isLoggedIn: true, userName})}/>}
        {isLoggedIn && <ChatView userName={userName}/>}
      </div>
    );
  }
}

App.propTypes = {
  t: PropTypes.func
};

export default App;
