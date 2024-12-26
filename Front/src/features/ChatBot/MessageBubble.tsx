// src/features/ChatBot/MessageBubble.tsx

import React from 'react';
import './MessageBubble.css';

interface MessageBubbleProps {
  sender: string;
  text?: string;
  imageUrl?: string; // 봇 이미지를 위한 속성
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, text, imageUrl }) => {
  const isUser = sender === 'user';
  const isBot = sender === 'bot';

  return (
    <div
      className={`message-container ${isUser ? 'user-message' : isBot ? 'bot-message' : 'generic-message'}`}
    >
      {isBot && imageUrl && (
        <img
          src={imageUrl}
          alt="bot avatar"
          className="bot-avatar"
        />
      )}
      <div
        className={`message-bubble ${isUser ? 'user-bubble' : isBot ? 'bot-bubble' : 'generic-bubble'}`}
      >
        {text}
      </div>
    </div>
  );
};

export default MessageBubble;
