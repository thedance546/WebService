// src/features/ChatBot/ChatInput.js
import React, { useState } from 'react';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import { Send, Plus } from 'react-bootstrap-icons';
import './ChatInput.css';

const ChatInput = ({ addMessage, toggleOptions, disabled }) => {
  const [input, setInput] = useState('');

  const handleInputChange = (event) => setInput(event.target.value);
  const handleSendMessage = () => {
    if (input.trim() !== '') {
      const messageToAdd = input.startsWith('#')
        ? { text: input.slice(1).trim(), sender: 'bot' }
        : { text: input, sender: 'user' };

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
    <div className="chat-input">
      <Button
        onClick={toggleOptions}
        className="me-2"
        style={{
          width: 'var(--button-size)',
          height: 'var(--button-size)',
          color: 'var(--button-icon-color)',
          fontSize: 'var(--option-icon-size)',
          borderRadius: '50%',
          backgroundColor: 'transparent',
        }}
      >
        <Plus />
      </Button>

      <Input
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요..."
        className="flex-grow-1"
        disabled={disabled}
      />

      <Button
        onClick={handleSendMessage}
        className="ms-2"
        style={{
          width: 'var(--button-size)',
          height: 'var(--button-size)',
          borderRadius: '50%',
          backgroundColor: 'transparent',
        }}
      >
        <Send />
      </Button>
    </div>
  );
};

export default ChatInput;
