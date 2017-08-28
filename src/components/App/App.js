import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Login from '../Login';
import ChatView from '../ChatView';
import s from './App.scss';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      userName: null,
      isLoggedIn: false,
      contacts: null
    };
    this.getContacts = this.getContacts.bind(this);
  }

  async getContacts() {
    const {data: contacts} = await axios.get('/api/contacts');
    this.setState({contacts});
  }

  onLoginClick(username) {
    axios.post('/api/login', {username});
    this.setState({isLoggedIn: true, userName: username});
    this.getContacts();
  }

  render() {
    const {userName, isLoggedIn, contacts} = this.state;
    return (
      <div className={s.root}>
        {!isLoggedIn && <Login onLoginClick={userName => this.onLoginClick(userName)}/>}
        {isLoggedIn && <ChatView userName={userName} contacts={contacts}/>}
      </div>
    );
  }
}

App.propTypes = {
  t: PropTypes.func
};

export default App;
