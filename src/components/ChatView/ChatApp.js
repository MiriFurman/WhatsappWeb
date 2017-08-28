import React from 'react';
import PropTypes from 'prop-types';

export default function ChatView(props) {
  return (<div>
    <ul data-hook="contact-list"/>
    <div data-hook="username">{props.userName}</div>
  </div>
  );
}

ChatView.propTypes = {
  userName: PropTypes.string.isRequired
};
