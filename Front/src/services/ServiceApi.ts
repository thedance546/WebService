// src/services/ServiceApi.ts

import { api, getAuthHeaders } from './Api';
import { handleApiError } from '../utils/Utils';

export const detectObjectsInImage = async (file: File): Promise<any> => {
    if (!file.type.startsWith('image/')) {
        throw new Error('유효하지 않은 파일 형식입니다. 이미지를 업로드하세요.');
    }

    const formData = new FormData();
    formData.append('image', file);

    console.log('[Ingredients API] 요청 준비 완료: 파일 이름 -', file.name);

    try {
        const headers = getAuthHeaders('Bearer');
        console.log('[Ingredients API] 헤더 정보:', headers);

        const response = await api.post('/items/detection', formData, { headers });
        console.log('[Ingredients API] 서버 응답 성공:', response.data);
        return response.data;
    } catch (error: any) {
        throw handleApiError(error, '이미지 탐지 실패.');
    }
};

export const recognizeReceipt = async (file: File): Promise<any> => {
    if (!file.type.startsWith('image/')) {
        throw new Error('유효하지 않은 파일 형식입니다. 이미지를 업로드하세요.');
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
        const headers = getAuthHeaders('Bearer');
        console.log('[OCR API] 헤더 정보:', headers);

        const response = await api.post('/receipts', formData, { headers });
        console.log('[OCR API] 서버 응답 성공:', response.data);
        return response.data;
    } catch (error: any) {
        throw handleApiError(error, '영수증 인식에 실패했습니다.');
    }
};

// 식재료 관리
export const createOrder = async (orderData: { orderDate: string; orderItems: { itemName: string; count: number }[] }): Promise<void> => {
    try {
        const headers = getAuthHeaders('Bearer');
        console.log('주문 등록 요청:', orderData);
        await api.post('/orders', orderData, { headers });
        console.log('주문 등록 성공:', orderData);
    } catch (error) {
        throw handleApiError(error, '주문 등록에 실패했습니다.');
    }
};

export const fetchOrders = async (): Promise<any[]> => {
    try {
        const headers = getAuthHeaders('Bearer');
        const response = await api.get('/orders', { headers });
        console.log('주문 목록 조회 성공:', response.data);
        return response.data;
    } catch (error) {
        throw handleApiError(error, '주문 목록 조회에 실패했습니다.');
    }
};

// 챗봇 UI
// 일반 질의
export const sendChatMessage = async (message: string): Promise<string> => {
    try {
      const response = await api.post('/chat/general/questions', { message });
      return response.data.reply;
    } catch (error: any) {
      throw handleApiError(error, '챗봇 메시지 전송 중 오류가 발생했습니다.');
    }
  };
  
// 레시피 추천

// 모든 메시지 조회