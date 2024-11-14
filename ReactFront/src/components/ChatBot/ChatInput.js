// src/components/ChatBot/ChatInput.js
import React, { useState } from 'react';
import { Send } from 'react-bootstrap-icons';

const ChatInput = ({ addMessage, toggleOptions }) => {
  const [input, setInput] = useState('');

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSendMessage = () => {
    if (input.trim() !== '') {
      addMessage({ text: input, sender: "user" });
      setInput('');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="d-flex align-items-center p-2 w-100" style={{ backgroundColor: 'transparent' }}>
      {/* + 버튼 (옵션 메뉴 토글) */}
      <button className="btn btn-outline-secondary me-2" style={{ width: '40px', height: '40px' }} onClick={toggleOptions}>
        +
      </button>

      {/* 텍스트 입력 필드 */}
      <input
        type="text"
        className="form-control flex-grow-1"
        placeholder="메시지를 입력하세요..."
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />

      {/* 전송 버튼 */}
      <button className="btn btn-primary ms-2" style={{ width: '40px', height: '40px' }} onClick={handleSendMessage} aria-label="전송">
        <Send size={24} />
      </button>
    </div>
  );
};

export default ChatInput;
