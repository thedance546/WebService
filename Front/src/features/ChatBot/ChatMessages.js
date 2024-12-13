// src/features/ChatBot/ChatMessages.js
import React, { useRef, useEffect } from 'react';
import './ChatBotStylesConfig.css';

const ChatMessages = ({ messages }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="overflow-auto p-3 bg-white border rounded" style={{ height: 'var(--chat-height)' }}>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`d-flex ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'} my-1`}
        >
          <div
            className={`p-2 rounded-3 ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-secondary text-white'}`}
            style={{
              maxWidth: '60%',
              backgroundColor: message.sender === 'user' ? 'var(--user-msg-bg)' : 'var(--bot-msg-bg)',
              borderRadius: 'var(--msg-border-radius)',
              textAlign: 'left',
            }}
          >
            {message.imageUrl ? (
              <img
                src={message.imageUrl}
                alt="uploaded"
                style={{ maxWidth: '100%', borderRadius: '10px' }}
              />
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
