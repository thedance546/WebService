// src/components/ChatBot/ChatInput.js
import React, { useState } from 'react';
import { Send } from 'react-bootstrap-icons';
import './ChatBotStylesConfig.css';

const ChatInput = ({ addMessage, toggleOptions, disabled }) => {
  const [input, setInput] = useState('');

  const handleInputChange = (event) => setInput(event.target.value);
  const handleSendMessage = () => {
    if (input.trim() !== '') {
      addMessage({ text: input, sender: "user" });
      setInput('');
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !disabled) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className="chat-input d-flex align-items-center position-fixed"
      style={{
        height: 'var(--input-height)',
        bottom: 'var(--input-bottom)',
        left: 'var(--input-left)',
        width: 'var(--input-width)',
        zIndex: 10,
      }}
    >
      <button
        className="btn btn-outline-secondary me-2"
        style={{ width: 'var(--button-width)', height: 'var(--button-height)' }}
        onClick={toggleOptions}
        disabled={disabled}
      >
        +
      </button>
      <input
        type="text"
        className="form-control flex-grow-1"
        placeholder="메시지를 입력하세요..."
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        style={{ height: 'var(--input-height)' }}
      />
      <button
        className="btn btn-primary ms-2"
        style={{ width: 'var(--button-width)', height: 'var(--button-height)' }}
        onClick={handleSendMessage}
        aria-label="전송"
        disabled={disabled}
      >
        <Send size="var(--icon-size)" />
      </button>
    </div>
  );
};

export default ChatInput;
