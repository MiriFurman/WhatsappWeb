import React from 'react';
import PropTypes from 'prop-types';
import {Text} from 'wix-style-react';

import {messageBubbleTimeFormatter} from './MessageBubbleTimeFormat';
import * as dh from './MessageBubbleDataHooks';
import * as s from './MessageBubble.scss';

export const MessageBubble = props => {
  const {id, body, created} = props; // can add ...props destruct if needed
  return (
    <div className={s.messageBubbleWrapper} data-message-id={id} data-hook={dh.Wrapper}>
      <div data-hook={dh.Item} className={props.currentUser ? s.fromMe : s.fromOthers}>
        <Text appearance={props.currentUser ? 'T1.2' : 'T1'} dataHook={dh.Body} className={s.msgBody}>{body}</Text>
      </div>
      <div data-hook={dh.Time} className={props.currentUser ? s.timeMe : s.timeThem}>
        <Text appearance="T3.4">
          {messageBubbleTimeFormatter(created)}
        </Text>
      </div>
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
