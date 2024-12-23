// src/features/ChatBot/MessageBubble.tsx

import React from 'react';
import './MessageBubble.css';

interface MessageBubbleProps {
  sender: string;
  text?: string;
  imageUrl?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, text, imageUrl }) => {
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

export default MessageBubble;
