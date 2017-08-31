import React from 'react';
import PropTypes from 'prop-types';
// import {Text} from 'wix-style-react';
import * as dh from './MessageBubbleDataHooks';
import * as s from './MessageBubble.scss';

export const MessageBubble = props => {
  const {id, body, created} = props; // can add ...props destruct if needed
  return (
    <div data-hook={dh.Item} className={s.messageBubbleWrapper} data-message-id={id}>
      <p data-hook={dh.Body}>{body}</p>
      <div data-hook={dh.Time} className={s.time}>{created}</div>
    </div>
  );
};

MessageBubble.propTypes = {
  id: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
};

export default MessageBubble;
