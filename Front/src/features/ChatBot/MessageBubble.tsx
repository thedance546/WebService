// src/features/ChatBot/MessageBubble.tsx

import React from 'react';
import { formatMessage } from '../../utils/FormatMessage';
import './MessageBubble.css';

interface MessageBubbleProps {
  sender: string;
  text?: string;
  profileImage?: string;
  attachedImage?: string;
  formatted?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, text, profileImage, attachedImage, formatted }) => {
  const isUser = sender === 'user';
  const isBot = sender === 'bot';

  return (
    <div
      className={`message-container d-flex ${
        isUser ? 'justify-content-end' : 'justify-content-start'
      } align-items-start mb-2`}
    >
      {isBot && profileImage && (
        <img
          src={profileImage}
          alt="bot avatar"
          className="bot-avatar"
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
        {/* 포맷팅 여부에 따라 처리 */}
        {formatted ? formatMessage(text || '') : <p className="message-text">{text}</p>}
        {attachedImage && (
          <img
            src={attachedImage}
            alt=''
            className="message-attached-image"
          />
        )}
      </div>
    </div>
  );
};

export default MessageBubble;