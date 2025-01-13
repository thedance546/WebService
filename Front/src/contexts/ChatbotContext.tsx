// src/context/ChatbotContext.tsx

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { fetchAllChatMessages } from '../services/ServiceApi';
import { Message } from '../types/FeatureTypes';

interface ChatbotContextType {
    imageData: string | null;
    setImageData: (data: string | null) => void;
    messages: Message[];
    setMessages: (messages: Message[]) => void;
    loadMessages: () => Promise<void>;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

interface ChatbotProviderProps {
    children: ReactNode;
}

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
    const [imageData, setImageData] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    const loadMessages = async () => {
        try {
            const data = await fetchAllChatMessages();
            setMessages(data);
        } catch (error) {
            console.error('메시지 로드 실패:', error);
        }
    };

    useEffect(() => {
        loadMessages();
    }, []);

    return (
        <ChatbotContext.Provider value={{ imageData, setImageData, messages, setMessages, loadMessages }}>
            {children}
        </ChatbotContext.Provider>
    );
};

export const useChatbotContext = (): {
    imageData: string | null;
    setImageData: (data: string | null) => void;
  } => {
    const context = useContext(ChatbotContext);
    if (!context) {
      throw new Error('useChatbotContext는 ChatbotProvider 내에서 사용해야 합니다.');
    }
    return {
      imageData: context.imageData,
      setImageData: context.setImageData,
    };
  };
