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
      className={`message-container d-flex ${
        isUser ? 'justify-content-end' : 'justify-content-start'
      } align-items-start mb-2`}
    >
      {isBot && imageUrl && (
        <img
          src={imageUrl}
          alt="bot avatar"
          className="bot-avatar"
          style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
        />
      )}
      <div
        className={`message-bubble p-2 rounded ${
          isUser ? 'bg-primary text-white' : 'bg-secondary text-white w-100'
        }`}
        style={{
          maxWidth: isUser ? '60%' : '100%',
          wordBreak: 'break-word',
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default MessageBubble;
