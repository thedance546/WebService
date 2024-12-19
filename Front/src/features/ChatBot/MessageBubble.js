// src/features/ChatBot/MessageBubble.js
import React from 'react';
import PropTypes from 'prop-types';

const MessageBubble = ({ sender, text, imageUrl }) => {
  const isUser = sender === 'user';

  return (
    <div
      className={`d-flex ${isUser ? 'justify-content-end' : 'justify-content-start'} my-1`}
    >
      <div
        className={`p-2 rounded-3 ${isUser ? 'bg-primary text-white' : 'bg-secondary text-white'}`}
        style={{
          maxWidth: '60%',
          backgroundColor: isUser ? 'var(--user-msg-bg)' : 'var(--bot-msg-bg)',
          borderRadius: 'var(--msg-border-radius)',
          textAlign: 'left',
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="uploaded"
            style={{ maxWidth: '100%', borderRadius: '10px' }}
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
