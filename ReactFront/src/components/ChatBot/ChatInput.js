// src/components/ChatBot/ChatInput.js
import React, { useState } from 'react';
import { Send } from 'react-bootstrap-icons';
import './ChatBotStyles.css';

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
      <button className="btn btn-outline-secondary me-2" style={{ width: 'var(--icon-size)', height: 'var(--icon-size)' }} onClick={toggleOptions}>
        +
      </button>

      <input
        type="text"
        className="form-control flex-grow-1"
        placeholder="메시지를 입력하세요..."
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />

      <button className="btn btn-primary ms-2" style={{ width: 'var(--icon-size)', height: 'var(--icon-size)' }} onClick={handleSendMessage} aria-label="전송">
        <Send size={24} />
      </button>
    </div>
  );
};

export default ChatInput;
