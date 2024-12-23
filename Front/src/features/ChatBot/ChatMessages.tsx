// src/features/ChatBot/ChatMessages.tsx

import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import './ChatMessages.css';

interface Message {
  sender: string;
  text?: string;
  imageUrl?: string;
}

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-messages-container">
      {messages.map((message, index) => (
        <MessageBubble
          key={index}
          sender={message.sender}
          text={message.text}
          imageUrl={message.imageUrl}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
