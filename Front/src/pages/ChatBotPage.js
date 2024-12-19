// src/pages/ChatBotPage.js
import React, { useState, useEffect, useRef } from 'react';
import ChatMessages from '../features/ChatBot/ChatMessages';
import ChatInput from '../features/ChatBot/ChatInput';
import OptionsModal from '../features/ChatBot/OptionsModal';
import HomeNavBar from '../components/organisms/HomeNavBar';
import NotificationBar from '../features/ChatBot/NotificationBar';

const ChatBotPage = () => {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      {/* 상단 알림창 */}
      <NotificationBar />

      {/* 채팅 메시지 영역 */}
      <ChatMessages messages={messages} />
      <div ref={chatEndRef} />

      {/* 입력창 */}
      <ChatInput addMessage={addMessage} toggleOptions={toggleOptions} disabled={isOptionsOpen} />

      {/* 옵션 모달 */}
      <OptionsModal
        isOpen={isOptionsOpen}
        onClose={toggleOptions}
        addMessage={addMessage}
        clearMessages={clearMessages}
        handleImageUpload={handleImageUpload}
      />

      {/* 하단 네비게이션 바 */}
      <HomeNavBar />
    </div>
  );
};

export default ChatBotPage;
