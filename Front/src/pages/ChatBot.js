// src/pages/ChatBot.js
import React, { useState, useEffect } from 'react';
import ChatMessages from '../features/ChatBot/ChatMessages';
import ChatInput from '../features/ChatBot/ChatInput';
import OptionsModal from '../features/ChatBot/OptionsModal';
import HomeNavBar from "../components/organisms/HomeNavBar";

const ChatBot = () => {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  // 동적 뷰포트 높이 설정 함수
  const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--viewport-height', `${vh * 100}px`);
  };

  useEffect(() => {
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    return () => {
      window.removeEventListener('resize', setViewportHeight);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  const handleImageUpload = (file) => {
    const imageUrl = URL.createObjectURL(file);
    addMessage({ sender: 'user', imageUrl });
  };

  const handleBotImageUpload = (file) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      addMessage({ sender: 'bot', imageUrl });
    }
  };

  const toggleOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  const options = [
    { label: '재료 사진 업로드', icon: '📷', action: () => document.getElementById('file-upload').click() },
    { label: '채팅 내역 지우기', icon: '🗑️', action: clearMessages },
    { label: '봇 사진 업로드', icon: '🤖📷', action: () => document.getElementById('bot-file-upload').click() },
  ];

  return (
    <div className="chatbot-container" style={{ overflow: 'auto', paddingBottom: '70px', paddingTop: '20px' }}>
      <div style={{ height: 'var(--top-margin)' }}></div>

      {/* 채팅 메시지 표시 */}
      <ChatMessages messages={messages} style={{ height: 'var(--chat-height)', overflowY: 'auto' }} />

      {/* 파일 업로드 인풋 (숨김 처리) */}
      <input
        type="file"
        id="file-upload"
        style={{ display: 'none' }}
        accept="image/*"
        onChange={(e) => {
          if (e.target.files.length > 0) handleImageUpload(e.target.files[0]);
        }}
      />

      {/* 봇 파일 업로드 인풋 (숨김 처리) */}
      <input
        type="file"
        id="bot-file-upload"
        style={{ display: 'none' }}
        accept="image/*"
        onChange={(e) => {
          if (e.target.files.length > 0) handleBotImageUpload(e.target.files[0]);
        }}
      />

      {/* 입력창 컴포넌트 */}
      <ChatInput addMessage={addMessage} toggleOptions={toggleOptions} disabled={isOptionsOpen} />

      {/* 옵션 모달 */}
      <OptionsModal isOpen={isOptionsOpen} onClose={toggleOptions} options={options} />

      <HomeNavBar />
    </div>
  );
};

export default ChatBot;
