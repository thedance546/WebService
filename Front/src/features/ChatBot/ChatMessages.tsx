// src/features/ChatBot/ChatMessages.tsx

import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { ChatMessagesProps } from '../../types/FeatureTypes';
import './ChatMessages.css';

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-messages-container border rounded bg-white p-2">
      {messages.map((message, index) => (
        <MessageBubble
          key={index}
          sender={message.sender}
          text={message.text}
          profileImage={message.profileImage}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
