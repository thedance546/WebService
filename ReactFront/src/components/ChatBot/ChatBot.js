// src/components/ChatBot/ChatBot.js
import React, { useState, useEffect } from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

const ChatBot = () => {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [{ text: "안녕하세요! 무엇을 도와드릴까요?", sender: "bot" }];
  });

  const [showOptions, setShowOptions] = useState(false);

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
    <div className="d-flex flex-column vh-100 bg-light position-relative">
      {/* 상단 여유 공간 */}
      <div style={{ height: '7vh' }}></div>

      {/* 대화 내용 (화면의 65%를 차지) */}
      <ChatMessages messages={messages} style={{ height: '75vh' }} />

      {/* 옵션 메뉴 */}
      {showOptions && (
        <div className="d-flex justify-content-around position-fixed w-100" style={{ bottom: '120px', zIndex: 10, backgroundColor: '#fff', padding: '10px', borderTop: '1px solid #ddd' }}>
          <label className="btn btn-outline-secondary" style={{ flex: 1, margin: '0 5px' }} aria-label="사진 업로드">
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} style={{ display: 'none' }} />
            📷
          </label>
          <button className="btn btn-outline-secondary" style={{ flex: 1, margin: '0 5px' }} onClick={clearMessages}>
            🗑️
          </button>
        </div>
      )}

      {/* 하단 고정 입력창 */}
      <div className="position-fixed w-100 d-flex align-items-center" style={{ bottom: '60px', zIndex: 10, backgroundColor: 'transparent' }}>
        <ChatInput addMessage={addMessage} toggleOptions={toggleOptions} />
      </div>
    </div>
  );
};

export default ChatBot;
