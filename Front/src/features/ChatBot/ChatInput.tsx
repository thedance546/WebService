// src/features/ChatBot/ChatInput.tsx

import React from 'react';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';
import { useChatInput } from '../../hooks/useChatInput';
import { Send, Plus } from 'react-bootstrap-icons';
import { ChatInputProps } from '../../types/FeatureTypes';
import './ChatInput.css';

const ChatInput: React.FC<ChatInputProps> = ({ addMessage, toggleOptions, disabled }) => {
  const { input, handleInputChange, handleSendMessage } = useChatInput(addMessage);

  return (
    <div className="chat-input d-flex align-items-center justify-content-between mt-2">
      {/* 옵션 버튼 */}
      <Button
        onClick={toggleOptions}
        className="chat-btn me-1"
        disabled={disabled}
      >
        <Plus />
      </Button>

      {/* 메시지 입력 필드 */}
      <Input
        value={input}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !disabled) handleSendMessage();
        }}
        placeholder="메시지를 입력하세요..."
        className="form-control flex-grow-1 me-1"
        disabled={disabled}
      />

      {/* 전송 버튼 */}
      <Button
        onClick={handleSendMessage}
        className="chat-btn"
        disabled={disabled}
      >
        <Send />
      </Button>
    </div>
  );
};

export default ChatInput;
