import React from 'react';
import PropTypes from 'prop-types';
import Input from 'wix-style-react/dist/src/Input';
import Button from 'wix-style-react/dist/src/Button';

class Login extends React.Component {
  constructor() {
    super();

    this.state = {userName: ''};
  }

  render() {
    return (<div data-hook="login-screen">
      <Input dataHook="login-username" onChange={evt => this.setState({userName: evt.target.value})}/>
      <Button dataHook="login-btn" onClick={() => this.props.onLoginClick(this.state.userName)}/>
    </div>);
  }
}

Login.propTypes = {
  onLoginClick: PropTypes.func.isRequired
};

export default Login;
