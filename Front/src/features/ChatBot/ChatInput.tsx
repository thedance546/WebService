// src/features/ChatBot/ChatInput.tsx

import React, { useState } from 'react';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import { Send, Plus } from 'react-bootstrap-icons';
import { ChatInputProps } from '../../types/FeatureTypes';
import './ChatInput.css';
import botAvatar from '../../assets/bot-avatar.png';

const ChatInput: React.FC<ChatInputProps> = ({ addMessage, toggleOptions, disabled }) => {
  const [input, setInput] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setInput(event.target.value);

  const handleSendMessage = () => {
    if (input.trim() !== '') {
      const messageToAdd = input.startsWith('#')
        ? { text: input.slice(1).trim(), sender: 'bot', imageUrl: botAvatar }
        : { text: input, sender: 'user' };

      addMessage(messageToAdd);
      setInput('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !disabled) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-input d-flex align-items-center justify-content-between">
      <Button
        onClick={toggleOptions}
        className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center me-2"
        style={{ width: '50px', height: '50px' }}
      >
        <Plus />
      </Button>

      <Input
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요..."
        className="form-control flex-grow-1 me-2"
        disabled={disabled}
      />

      <Button
        onClick={handleSendMessage}
        className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
        style={{ width: '50px', height: '50px' }}
      >
        <Send />
      </Button>
    </div>
  );
};

export default ChatInput;
