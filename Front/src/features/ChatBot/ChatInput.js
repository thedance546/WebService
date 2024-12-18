// src/features/ChatBot/ChatInput.js
import React, { useState } from 'react';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import { Send, Plus } from 'react-bootstrap-icons'; // Plus 아이콘 추가

const ChatInput = ({ addMessage, toggleOptions, disabled }) => {
  const [input, setInput] = useState('');

  const handleInputChange = (event) => setInput(event.target.value);
  const handleSendMessage = () => {
    if (input.trim() !== '') {
      let messageToAdd;

      if (input.startsWith('#')) {
        messageToAdd = { text: input.slice(1).trim(), sender: 'bot' };
      } else {
        messageToAdd = { text: input, sender: 'user' };
      }

      addMessage(messageToAdd);
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
        backgroundColor: 'var(--input-bg-color)',
        borderRadius: '20px',
        padding: '5px 10px',
      }}
    >
      
      <Button
        onClick={toggleOptions}
        className="me-2"
        style={{
          width: 'var(--button-size)',
          height: 'var(--button-size)',
          borderRadius: '50%',
          color: 'var(--button-icon-color)',
          fontSize: '20px',
        }}
        variant="light"
        disabled={disabled}
      >
        <Plus />
      </Button>

      <Input
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요..."
        className="flex-grow-1"
        style={{
          backgroundColor: 'var(--input-bg-color)',
          color: 'var(--input-text-color)',
          border: '1px solid var(--input-border-color)',
          borderRadius: '15px',
          padding: '5px 10px',
        }}
        disabled={disabled}
      />
      <Button
        onClick={handleSendMessage}
        className="ms-2"
        style={{
          backgroundColor: 'transparent', // 배경색 투명
          color: 'black',
          width: 'var(--button-width)',
          height: 'var(--button-height)',
          borderRadius: '50%',
        }}
        variant="light"
        aria-label="전송"
        disabled={disabled}
      >
        <Send style={{ color: 'var(--button-icon-color)', fontSize: 'var(--icon-size)' }} />
      </Button>
    </div>
  );
};

export default ChatInput;
