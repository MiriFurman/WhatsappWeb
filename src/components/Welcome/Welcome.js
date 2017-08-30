import React from 'react';
import {Text} from 'wix-style-react';
import * as s from './Welcome.scss';
import logo from './../../assets/scream-logo.png';

export const Welcome = () => {
  return (
    <div data-hook="welcome-screen" className={s.welcomeWrapper}>
      <img src={logo}/>
      <Text dataHook="welcome-text">Welcome to Wazzappppp</Text>
    </div>);
};

export default Welcome;
