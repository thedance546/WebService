// src/features/ChatBot/MessageBubble.tsx

import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  sender: string;
  text?: string;
  profileImage?: string;
  attachedImage?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, text, profileImage, attachedImage }) => {
  const isUser = sender === 'user';

  const containerStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '10px',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
  };

  const bubbleStyle = {
    padding: '10px',
    borderRadius: '10px',
    backgroundColor: isUser ? '#007bff' : '#6c757d',
    color: 'white',
    maxWidth: isUser ? '60%' : '80%',
    wordBreak: 'break-word' as 'break-word',
  };

  return (
    <div style={containerStyle}>
      {!isUser && profileImage && (
        <img
          src={profileImage}
          alt="bot avatar"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            marginRight: '10px',
          }}
        />
      )}
      {text && (
        <div style={bubbleStyle}>
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      )}
      {attachedImage && (
        <img
          src={attachedImage}
          alt="Attached"
          style={{ maxWidth: '60%', borderRadius: '8px', marginTop: '10px' }}
        />
      )}
    </div>
  );
};

export default MessageBubble;
