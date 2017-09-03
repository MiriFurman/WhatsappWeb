import React, {Component} from 'react';
import {TextField, Input, Label, Button, Text} from 'wix-style-react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import * as s from './Signup.scss';

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      verifyPassword: ''
    };
  }

  render() {
    const {onSignupClick} = this.props;
    return (<div data-hook="signup-screen" className={s.signupContainer}>
      <div className={s.signupBox}>
        <Text appearance="H1" dataHook="signup-heading">Welcome to Wazzap</Text>
        <Text appearance="T1">Create your account by filling the form bellow.</Text>
        <div className={s.signupForm}>
          <div className={s.inputField}>
            <TextField>
              <Label appearance="T1.1" for="username">User Name</Label>
              <Input
                id="username" size="normal" maxLength={524288} textOverflow="clip"
                theme="normal" width="initial" dataHook="signup-username"
                onChange={evt => this.setState({username: evt.target.value})}
                />
            </TextField>
          </div>
          <div className={s.inputField}>
            <TextField>
              <Label appearance="T1.1" for="password">Password</Label>
              <Input
                id="password" size="normal" maxLength={524288} textOverflow="clip"
                theme="normal" width="initial" dataHook="signup-password"
                onChange={evt => this.setState({password: evt.target.value})}
                />
            </TextField>
          </div>
          <div className={s.inputField}>
            <TextField>
              <Label appearance="T1.1" for="password">Verify Password</Label>
              <Input
                id="verify-password" size="normal" maxLength={524288} textOverflow="clip"
                theme="normal" width="initial" dataHook="signup-verify-password"
                onChange={evt => this.setState({verifyPassword: evt.target.value})}
                />
            </TextField>
          </div>
          <div className={s.buttomRight}>
            <Button
              dataHook="signup-btn"
              onClick={() => {
                onSignupClick(this.state.username, this.state.password);
              }}
              >Signup</Button>
          </div>
          <div className={s.buttomLeft}>
            <Link data-hook="signup-link" to="/login">
              <Text size="small">Login</Text>
            </Link>
          </div>
        </div>
      </div>
    </div>);
  }

}

Signup.propTypes = {
  onSignupClick: PropTypes.func.isRequired
};

export default Signup;
