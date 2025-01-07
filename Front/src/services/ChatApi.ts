// src/services/ChatApi.ts

import { api } from './Api';
import { handleApiError } from '../utils/Utils';

export const sendChatMessage = async (message: string): Promise<string> => {
  try {
    const response = await api.post('/chat/ask', { message });
    return response.data.reply;
  } catch (error: any) {
    console.error('Chat API 통신 오류:', error);
    throw handleApiError(error, '챗봇 메시지 전송 중 오류가 발생했습니다.');
  }
};
