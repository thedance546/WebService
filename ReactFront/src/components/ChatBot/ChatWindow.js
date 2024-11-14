// src/components/ChatBot/ChatWindow.js

import React from 'react';
import MessageBubble from './MessageBubble';
import './ChatWindow.css';

const ChatWindow = ({ messages }) => {
  return (
    <div className="chat-window">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} text={msg.text} sender={msg.sender} />
      ))}
    </div>
  );
};

export default ChatWindow;
