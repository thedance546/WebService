// src/components/ChatBot/ChatWindow.js

import React from 'react';

const ChatWindow = ({ messages }) => {
  return (
    <div className="card flex-grow-1 overflow-auto p-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`mb-2 p-2 rounded ${msg.sender === 'user' ? 'bg-success text-white align-self-end' : 'bg-primary text-white align-self-start'}`}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
