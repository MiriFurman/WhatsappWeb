import React from 'react';
import PropTypes from 'prop-types';
import {Text} from 'wix-style-react';

import {messageBubbleTimeFormatter} from './MessageBubbleTimeFormat';
import * as dh from './MessageBubbleDataHooks';
import * as s from './MessageBubble.scss';

export const MessageBubble = props => {
  const {id, body, created, groupMessage, createdByName, playMsg} = props; // can add ...props destruct if needed
  return (
    <div className={s.messageBubbleWrapper} data-message-id={id} data-hook={dh.Wrapper}>
      <div data-hook={dh.Item} className={props.currentUser ? s.fromMe : s.fromOthers}>
        <Text appearance={props.currentUser ? 'T1.2' : 'T1'} dataHook={dh.Body} className={s.msgBody}>{body}</Text>
        <button className={s.speakerBtn} onClick={() => playMsg([body])}>🔈</button>
      </div>
      <div data-hook={dh.Time} className={props.currentUser ? s.timeMe : s.timeThem}>
        <Text appearance="T3.4">
          {`${groupMessage ? createdByName.name : ''} ${messageBubbleTimeFormatter(created)}`}
        </Text>
      </div>
    </div>
  );
};

MessageBubble.propTypes = {
  id: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
  currentUser: PropTypes.bool,
  groupMessage: PropTypes.bool,
  createdBy: PropTypes.string,
  playMsg: PropTypes.func,
  createdByName: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};

export default MessageBubble;
