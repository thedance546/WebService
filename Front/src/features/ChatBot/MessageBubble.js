// src/features/ChatBot/MessageBubble.js
import React from 'react';
import PropTypes from 'prop-types';
import './MessageBubble.css';

const MessageBubble = ({ sender, text, imageUrl }) => {
  const isUser = sender === 'user';
  const isBot = sender === 'bot';

  return (
    <div
      className={`message-container ${isUser ? 'user-message' : isBot ? 'bot-message' : 'generic-message'}`}
    >
      <div
        className={`message-bubble ${isUser ? 'user-bubble' : isBot ? 'bot-bubble' : 'generic-bubble'}`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="uploaded"
            className="message-image"
          />
        ) : (
          text
        )}
      </div>
    </div>
  );
};

MessageBubble.propTypes = {
  sender: PropTypes.string.isRequired,
  text: PropTypes.string,
  imageUrl: PropTypes.string,
};

MessageBubble.defaultProps = {
  text: '',
  imageUrl: null,
};

export default MessageBubble;
