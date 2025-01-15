// src/context/ChatbotContext.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Message, Sender } from '../types/FeatureTypes';
import botAvatar from '../assets/matjipsa_logo_small.webp';

interface ChatbotContextType {
    imageData: string | null;
    setImageData: (data: string | null) => void;
    messages: Message[];
    addMessage: (message: Message) => void;
    clearMessages: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

interface ChatbotProviderProps {
    children: ReactNode;
}

const getInitialMessages = (): Message[] => [
    {
        sender: Sender.Bot,
        text: '안녕하세요! 맛집사 챗봇입니다! 🤖\n\n식재료 정보나 관리에 대해 물어보세요\n\nAI 레시피 추천은 옵션에서 할 수 있습니다',
        profileImage: botAvatar,
    },
];

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
    const [imageData, setImageData] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>(getInitialMessages);

    const addMessage = (message: Message) => {
        setMessages((prev) => [...prev, message]);
    };

    const clearMessages = () => {
        setMessages(getInitialMessages());
        localStorage.removeItem('chatMessages');
    };

    return (
        <ChatbotContext.Provider value={{ imageData, setImageData, messages, addMessage, clearMessages }}>
            {children}
        </ChatbotContext.Provider>
    );
};

export const useChatbotContext = (): ChatbotContextType => {
    const context = useContext(ChatbotContext);
    if (!context) {
        throw new Error('useChatbotContext는 ChatbotProvider 내에서 사용해야 합니다.');
    }
    return context;
};

