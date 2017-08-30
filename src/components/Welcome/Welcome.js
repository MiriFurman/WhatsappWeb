import React from 'react';
import {Text} from 'wix-style-react';
import * as s from './Welcome.scss';
import logo from './../../assets/logo.png';

export const Welcome = () => {
  return (
    <div data-hook="welcome-screen" className={s.welcomeWrapper}>
      <img src={logo}/>
      <Text appearance="H1" dataHook="welcome-text">Welcom to Wazzap!!!</Text>
    </div>);
};

export default Welcome;
