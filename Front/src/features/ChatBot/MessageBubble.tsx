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

  const bubbleStyle = {
    padding: '10px',
    borderRadius: '10px',
    backgroundColor: isUser ? '#007bff' : '#6c757d',
    color: 'white',
    maxWidth: isUser ? '60%' : '100%',
    wordBreak: 'break-word' as 'break-word',
  };

  const formattedText = text?.replace(/\\n/g, '\n').split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

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
            alignSelf: 'flex-start',
          }}
        />
      )}
      <div style={bubbleStyle}>
        {formattedText}
        {attachedImage && (
          <img
            src={attachedImage}
            alt="Attached"
            style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '10px' }}
          />
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
