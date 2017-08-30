import React from 'react';
import PropTypes from 'prop-types';
// import {Text} from 'wix-style-react';
import * as dh from './MessageBubbleDataHooks';
import * as s from './MessageBubble.scss';

export const MessageBubble = props => {
  return (
    <div data-hook={dh.Item} className={s.messageBubbleWrapper}>
      <p>{props.message}</p>
      <div data-hook={dh.Time} className={s.time}>{props.time}</div>
    </div>
  );
};

MessageBubble.propTypes = {
  message: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired
};

export default MessageBubble;
