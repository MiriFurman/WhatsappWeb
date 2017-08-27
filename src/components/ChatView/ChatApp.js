import React from 'react';
import PropTypes from 'prop-types';

export default function ChatView(props) {
  return <div data-hook="username">{props.userName}</div>;
}

ChatView.propTypes = {
  userName: PropTypes.string.isRequired
};
