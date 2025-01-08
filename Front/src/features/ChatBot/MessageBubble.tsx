// src/features/ChatBot/MessageBubble.tsx

import React from 'react';
import './MessageBubble.css';

interface MessageBubbleProps {
  sender: string;
  text?: string;
  profileImage?: string;
  attachedImage?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, text, profileImage, attachedImage }) => {
  const isUser = sender === 'user';
  const isBot = sender === 'bot';

  return (
    <div
      className={`message-container d-flex ${
        isUser ? 'justify-content-end' : 'justify-content-start'
      } align-items-start mb-2`}
    >
      {/* 프로필 이미지 */}
      {isBot && profileImage && (
        <img
          src={profileImage}
          alt="bot avatar"
          className="bot-avatar"
        />
      )}

      {/* 메시지 버블 */}
      <div
        className={`message-bubble p-2 rounded ${
          isUser ? 'bg-primary text-white' : 'bg-secondary text-white w-100'
        }`}
        style={{
          maxWidth: isUser ? '60%' : '100%',
          wordBreak: 'break-word',
        }}
      >
        {text && <p className="message-text">{text}</p>}
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
