// src/hooks/useChatInput.ts

import { useState } from 'react';
import { useChatbotContext } from '../contexts/ChatbotContext';
import botAvatar from '../assets/matjipsa_logo.webp';
import { Sender } from '../types/FeatureTypes';
import { fetchGeneralChatResponse } from '../services/ServiceApi';

export const useChatInput = () => {
    const [input, setInput] = useState<string>('');
    const { addMessage } = useChatbotContext();

    const handleInputChange = (value: string) => {
        setInput(value);
    };

    const handleSendMessage = async () => {
        if (input.trim() !== '') {
            // 사용자 메시지 추가
            addMessage({ text: input, sender: Sender.User });

            try {
                const response = await fetchGeneralChatResponse(input);
                addMessage({ text: response, sender: Sender.Bot, profileImage: botAvatar });
            } catch (error) {
                console.error('챗봇 응답 실패:', error);
                addMessage({ text: '오류가 발생했습니다.', sender: Sender.Bot, profileImage: botAvatar });
            }

            setInput('');
        }
    };

    return {
        input,
        handleInputChange,
        handleSendMessage,
    };
};
