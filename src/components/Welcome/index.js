import React from 'react';
import {Text} from 'wix-style-react';
import logo from '../../resources/scream-logo.png';

export const Welcome = () => {
  const style = {
    display: 'flex',
    flexFlow: 'column',
  };
  const imgStyle = {
    width: '256px',
    alignSelf: 'center'
  };
  return (
    <div data-hook="welcome-screen" style={style}>
      <img src={logo} style={imgStyle}/>
      <Text dataHook="welcome-text">Welcome to Wazzappppp</Text>
    </div>);
};

export default Welcome;
