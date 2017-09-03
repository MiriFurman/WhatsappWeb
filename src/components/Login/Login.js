import React from 'react';
import PropTypes from 'prop-types';
import Input from 'wix-style-react/dist/src/Input';
import Button from 'wix-style-react/dist/src/Button';
import TextField from 'wix-style-react/dist/src/TextField';
import Text from 'wix-style-react/dist/src/Text';
import Label from 'wix-style-react/dist/src/Label';
import Checkbox from 'wix-style-react/dist/src/Checkbox';
import s from './Login.scss';
import {Link} from 'react-router-dom';


class Login extends React.Component {
  constructor() {
    super();

    this.state = {username: '', checked: true};
  }

  render() {
    return (<div data-hook="login-screen" className={s.loginContainer}>
      <div className={s.loginBox}>
        <Text appearance="H1" dataHook="login-heading">Welcome to Wazzap</Text>
        <Text appearance="T1">Sign in to your account by filling the form bellow.</Text>
        <div className={s.loginForm}>
          <div className={s.inputField}>
            <TextField>
              <Label appearance="T1.1" for="username">User Name</Label>
              <Input
                id="username" size="normal" maxLength={524288} textOverflow="clip"
                theme="normal" width="initial" dataHook="login-username"
                onChange={evt => this.setState({username: evt.target.value})}
                />
            </TextField>
          </div>
          <div className={s.inputField}>
            <TextField>
              <Label appearance="T1.1" for="password">Password</Label>
              <Input
                disabled id="password" size="normal" maxLength={524288} textOverflow="clip"
                theme="normal" width="initial" dataHook="login-password"
                onChange={evt => this.setState({password: evt.target.value})}
                />
            </TextField>
          </div>
          <div className={s.inputField}>
            <Checkbox
              checked={this.state.checked}
              onChange={() => this.setState({checked: !this.state.checked})}
              >Remember
              me</Checkbox>
          </div>
          <div className={s.buttomRight}>
            <Button
              dataHook="login-btn"
              onClick={() => this.props.onLoginClick(this.state.username)}
              >Login</Button>
          </div>
          <div className={s.buttomLeft}>
            <Link data-hook="signup-link" to="/signup">
              <Text size="small">Sign up</Text>
            </Link>
          </div>
        </div>
      </div>
    </div>);
  }
}

Login.propTypes = {
  onLoginClick: PropTypes.func.isRequired
};

export default Login;
