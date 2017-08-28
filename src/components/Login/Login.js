import React from 'react';
import PropTypes from 'prop-types';
import Input from 'wix-style-react/dist/src/Input';
import Button from 'wix-style-react/dist/src/Button';

class Login extends React.Component {
  constructor() {
    super();

    this.state = {username: ''};
  }

  render() {
    return (<div data-hook="login-screen">
      <Input dataHook="login-username" onChange={evt => this.setState({username: evt.target.value})}/>
      <Button dataHook="login-btn" onClick={() => this.props.onLoginClick(this.state.username)}/>
    </div>);
  }
}

Login.propTypes = {
  onLoginClick: PropTypes.func.isRequired
};

export default Login;
