// src/features/ChatBot/MessageBubble.tsx

import React from 'react';

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

  const avatarStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px',
    alignSelf: 'flex-start',
  };

  const bubbleStyle = {
    padding: '10px',
    borderRadius: '10px',
    backgroundColor: isUser ? '#007bff' : '#6c757d',
    color: 'white',
    maxWidth: isUser ? '60%' : '100%',
    wordBreak: 'break-word' as 'break-word',
  };

  const imageStyle = {
    maxWidth: '100%',
    borderRadius: '8px',
    marginTop: '10px',
  };

  return (
    <div style={containerStyle}>
      {!isUser && profileImage && <img src={profileImage} alt="bot avatar" style={avatarStyle} />}
      <div style={bubbleStyle}>
        {text && <p style={{ margin: 0 }}>{text}</p>}
        {attachedImage && <img src={attachedImage} alt="" style={imageStyle} />}
      </div>
    </div>
  );
};

export default MessageBubble;
