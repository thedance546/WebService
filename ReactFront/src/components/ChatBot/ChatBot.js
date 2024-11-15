// src/components/ChatBot/ChatBot.js
import React, { useState, useEffect } from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import './ChatBotStyles.css';

const ChatBot = () => {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [{ text: "안녕하세요! 무엇을 도와드릴까요?", sender: "bot" }];
  });

  const [showOptions, setShowOptions] = useState(false);

  // 동적 뷰포트 높이 설정 함수
  const setViewportHeight = () => {
    document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
  };

  useEffect(() => {
    // 페이지 로드 및 리사이즈 시 동적 높이 설정
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
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
    setMessages([{ text: "대화가 초기화되었습니다.", sender: "bot" }]);
    localStorage.removeItem('chatMessages');
  };

  const handleImageUpload = async (file) => {
    const imageUrl = URL.createObjectURL(file);
    addMessage({ sender: 'user', imageUrl });

    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('YOUR_AI_SERVER_ENDPOINT', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      addMessage({ sender: 'bot', text: `분석 결과: ${JSON.stringify(result)}` });
    } catch (error) {
      addMessage({ sender: 'bot', text: '이미지 분석 중 오류가 발생했습니다.' });
    }
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className="chatbot-container">
      <div style={{ height: 'var(--top-margin)' }}></div>

      <ChatMessages messages={messages} style={{ height: 'var(--chat-height)', overflowY: 'auto' }} />

      {showOptions && (
        <div className="d-flex justify-content-around position-fixed w-100"
             style={{ bottom: 'var(--options-bottom)', zIndex: 10, backgroundColor: 'var(--options-bg-color)', padding: 'var(--options-padding)', borderTop: `1px solid var(--options-border-color)` }}>
          <label className="btn btn-outline-secondary" style={{ flex: 1, margin: '0 5px' }} aria-label="사진 업로드">
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} style={{ display: 'none' }} />
            📷
          </label>
          <button className="btn btn-outline-secondary" style={{ flex: 1, margin: '0 5px' }} onClick={clearMessages}>
            🗑️
          </button>
        </div>
      )}

      <div className="position-fixed w-100 d-flex align-items-center"
           style={{ bottom: 'var(--input-bottom)', zIndex: 10, backgroundColor: 'transparent' }}>
        <ChatInput addMessage={addMessage} toggleOptions={toggleOptions} />
      </div>
    </div>
  );
};

export default ChatBot;
