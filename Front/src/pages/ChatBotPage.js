// src/pages/ChatBotPage.js
import React, { useState, useEffect } from 'react';
import ChatMessages from '../features/ChatBot/ChatMessages';
import ChatInput from '../features/ChatBot/ChatInput';
import OptionsModal from '../features/ChatBot/OptionsModal';
import HomeNavBar from "../components/organisms/HomeNavBar";

const ChatBotPage = () => {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const addMessage = (message) => {
    setMessages((prevMessages) => (Array.isArray(prevMessages) ? [...prevMessages, message] : [message]));
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  const toggleOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  const handleImageUpload = (file) => {
    const imageUrl = URL.createObjectURL(file);
    addMessage({ sender: 'user', imageUrl });
  };

  return (
    <div className="chatbot-container">
      <ChatMessages messages={messages} style={{ height: 'var(--chat-height)', overflowY: 'auto' }} />

      <ChatInput addMessage={addMessage} toggleOptions={toggleOptions} disabled={isOptionsOpen} />

      <OptionsModal
        isOpen={isOptionsOpen}
        onClose={toggleOptions}
        addMessage={addMessage}
        clearMessages={clearMessages}
        handleImageUpload={handleImageUpload}
      />

      <HomeNavBar />
    </div>
  );
};

export default ChatBotPage;