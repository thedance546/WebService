// src/features/ChatBot/ChatInput.tsx

import React, { useState } from 'react';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import { Send, Plus } from 'react-bootstrap-icons';
import './ChatInput.css';

interface ChatInputProps {
  addMessage: (message: { text: string; sender: string }) => void;
  toggleOptions: () => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ addMessage, toggleOptions, disabled }) => {
  const [input, setInput] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => setInput(event.target.value);

  const handleSendMessage = () => {
    if (input.trim() !== '') {
      const messageToAdd = input.startsWith('#')
        ? { text: input.slice(1).trim(), sender: 'bot' }
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
        style={{ width: '50px', height: '50px' } as React.CSSProperties}
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
        className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center ms-2"
        style={{ width: '50px', height: '50px' } as React.CSSProperties}
      >
        <Send />
      </Button>
    </div>
  );
};

export default ChatInput;
