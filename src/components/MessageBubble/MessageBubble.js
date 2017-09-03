import React from 'react';
import PropTypes from 'prop-types';
// import {Text} from 'wix-style-react';

import {messageBubbleTimeFormatter} from './MessageBubbleTimeFormat';
import * as dh from './MessageBubbleDataHooks';
import * as s from './MessageBubble.scss';

export const MessageBubble = props => {
  const {id, body, created} = props; // can add ...props destruct if needed
  return (
    <div className={s.messageBubbleWrapper} data-message-id={id} data-hook={dh.Wrapper}>
      <div data-hook={dh.Item} className={props.currentUser ? s.fromMe : s.fromOthers}>
        <p data-hook={dh.Body}>{body}</p>
      </div>
      <div data-hook={dh.Time} className={s.timeMe}>{messageBubbleTimeFormatter(created)}</div>
    </div>
  );
};

MessageBubble.propTypes = {
  id: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
  currentUser: PropTypes.bool
};

export default MessageBubble;
