// src/components/ChatBot/ChatBot.js

import React, { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages'));
    if (savedMessages) setMessages(savedMessages);
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const addMessage = (message) => {
    setMessages([...messages, message]);
  };

  return (
    <div className="d-flex flex-column h-100">
      <ChatWindow messages={messages} />
      <MessageInput onSend={addMessage} />
    </div>
  );
};

export default ChatBot;
