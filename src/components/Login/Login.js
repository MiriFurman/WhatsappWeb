import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Input from 'wix-style-react/dist/src/Input';
import Button from 'wix-style-react/dist/src/Button';
import TextField from 'wix-style-react/dist/src/TextField';
import Text from 'wix-style-react/dist/src/Text';
import Label from 'wix-style-react/dist/src/Label';
import Checkbox from 'wix-style-react/dist/src/Checkbox';
import s from './Login.scss';
import {Link} from 'react-router-dom';
import {observer, inject} from 'mobx-react';

@inject('chatStore')
@observer
class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      checked: true
    };
  }

  render() {
    const {username, password} = this.state;
    const {chatStore} = this.props;
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
                id="password" size="normal" maxLength={524288} textOverflow="clip"
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
          {chatStore.authenticationProblem &&
          <div className="authenticationError">
            <Text appearance="T4" dataHook="authentication-problem">Wrong credentials, please try
              again</Text>
          </div>}
          <div className={s.buttomRight}>
            <Button
              dataHook="login-btn"
              onClick={() => this.props.onLoginClick({username, password})}
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
  onLoginClick: PropTypes.func.isRequired,
  chatStore: PropTypes.object
};
Login.defaultProps = {
  onLoginClick: () => {}
};


export default Login;
