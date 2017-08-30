import React from 'react';
import PropTypes from 'prop-types';
import Input from 'wix-style-react/dist/src/Input';
import Button from 'wix-style-react/dist/src/Button';
import TextField from 'wix-style-react/dist/src/TextField';
import Text from 'wix-style-react/dist/src/Text';
import Label from 'wix-style-react/dist/src/Label';
import s from './Login.scss';


class Login extends React.Component {
  constructor() {
    super();

    this.state = {username: ''};
  }

  render() {
    return (<div data-hook="login-screen" className={s.loginContainer}>
      <div className={s.loginBox}>
        <Text appearance="H1">Welcome to Wazzap</Text>
        <Text appearance="T1">Sign in to your account by filling the form bellow.</Text>
        <TextField>
          <Label appearance="T1.1" for="username">User Name</Label>
          <Input id="username" size="normal" maxLength={524288} textOverflow="clip" theme="normal" width="initial" dataHook="login-username" onChange={evt => this.setState({username: evt.target.value})}/>
        </TextField>
        <Button dataHook="login-btn" onClick={() => this.props.onLoginClick(this.state.username)}>Login</Button>
      </div>
    </div>);
  }
}

Login.propTypes = {
  onLoginClick: PropTypes.func.isRequired
};

export default Login;
