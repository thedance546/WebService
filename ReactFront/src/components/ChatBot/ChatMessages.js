// src/components/ChatBot/ChatMessages.js
import React, { useRef, useEffect } from 'react';

const ChatMessages = ({ messages, style }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="overflow-auto p-3 bg-white border rounded" style={{ ...style, overflowY: 'auto' }}>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`d-flex ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'} my-1`}
        >
          <div
            className={`p-2 rounded-3 ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-secondary text-white'} ${message.sender === 'user' ? 'rounded-end' : 'rounded-start'}`}
            style={{ maxWidth: '60%' }}
          >
            {message.imageUrl ? (
              <img src={message.imageUrl} alt="미리보기" style={{ maxWidth: '100%', borderRadius: '10px' }} />
            ) : (
              message.text
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
