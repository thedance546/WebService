// src/hooks/useChatInput.ts

import { useState } from 'react';
import botAvatar from '../assets/bot-avatar.png';

export const useChatInput = (addMessage: (message: any) => void) => {
  const [input, setInput] = useState('');

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const handleSendMessage = () => {
    if (input.trim() !== '') {
      const messageToAdd = input.startsWith('#')
        ? { text: input.slice(1).trim(), sender: 'bot', imageUrl: botAvatar }
        : { text: input, sender: 'user' };

      addMessage(messageToAdd);
      setInput('');
    }
  };

  return {
    input,
    handleInputChange,
    handleSendMessage,
  };
};
