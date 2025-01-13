// src/services/ServiceApi.ts

import { api, getAuthHeaders } from './Api';
import { handleApiError } from '../utils/Utils';
import { OrderRequest,
    ImageDetectionResult,
    ReceiptRecognitionResult } from '../types/FeatureTypes';

/**
 * 이미지 업로드 및 데이터 반환 공통 함수
 * @param endpoint API 엔드포인트
 * @param file 업로드할 이미지 파일
 * @param errorMessage 오류 메시지
 * @returns 서버 응답 데이터
 */
const uploadImageToEndpoint = async <T>(
    endpoint: string,
    file: File,
    errorMessage: string
): Promise<T> => {
    if (!file.type.startsWith('image/')) {
        throw new Error('유효하지 않은 파일 형식입니다. 이미지를 업로드하세요.');
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
        const headers = getAuthHeaders('Bearer');
        const response = await api.post(endpoint, formData, { headers });
        return response.data as T;
    } catch (error) {
        throw handleApiError(error, errorMessage);
    }
};

 // 식재료 인식 API
export const detectObjectsInImage = async (file: File): Promise<ImageDetectionResult> => {
    return uploadImageToEndpoint<ImageDetectionResult>(
        '/items/detection',
        file,
        '식재료 인식에 실패했습니다.'
    );
};

 // 영수증 인식 API
export const recognizeReceipt = async (file: File): Promise<ReceiptRecognitionResult> => {
    return uploadImageToEndpoint<ReceiptRecognitionResult>(
        '/receipts',
        file,
        '영수증 인식에 실패했습니다.'
    );
};

// 식재료 관리 API
const createOrder = async (endpoint: string, orderData: OrderRequest): Promise<void> => {
    try {
        const headers = getAuthHeaders('Bearer');
        console.log(`${endpoint} 주문 등록 요청:`, orderData);
        await api.post(endpoint, orderData, { headers });
        console.log(`${endpoint} 주문 등록 성공:`, orderData);
    } catch (error) {
        throw handleApiError(error, `${endpoint} 주문 등록에 실패했습니다.`);
    }
};

// 영수증으로 주문 자동 등록
export const createReceiptsOrder = async (orderData: OrderRequest): Promise<void> => {
    await createOrder('/ingredients/receipts', orderData);
};

// 수동 주문 등록
export const createManualOrder = async (orderData: OrderRequest): Promise<void> => {
    await createOrder('/ingredients/manual', orderData);
};

export const fetchOrders = async (): Promise<any[]> => {
    try {
        const headers = getAuthHeaders('Bearer');
        const response = await api.get('/ingredients', { headers });
        console.log('주문 목록 조회 성공:', response.data);
        return response.data;
    } catch (error) {
        throw handleApiError(error, '주문 목록 조회에 실패했습니다.');
    }
};

// 수량 업데이트
export const updateIngredientQuantity = async (orderItemId: number, newCount: number): Promise<void> => {
    try {
        const headers = getAuthHeaders('Bearer');
        const response = await api.put(`/ingredients/${orderItemId}?newCount=${newCount}`, null, { headers });
        console.log('수량 업데이트 성공:', response.data);
    } catch (error) {
        throw handleApiError(error, '수량 업데이트 중 오류가 발생했습니다.');
    }
};

// 식재료 삭제
export const deleteUserIngredient = async (orderItemId: number): Promise<string> => {
    try {
        const headers = getAuthHeaders('Bearer');
        console.log(`[DELETE] 요청 준비: /api/ingredients/${orderItemId}`);

        const response = await api.delete(`/ingredients/${orderItemId}`, { headers });
        console.log('식재료 삭제 성공:', response.data);
        return response.data.message || '식재료가 성공적으로 삭제되었습니다.';
    } catch (error: any) {
        throw handleApiError(error, '식재료 삭제 중 오류가 발생했습니다.');
    }
};

// 챗봇 UI
/**
 * 공통 API 호출 함수
 * @param endpoint - API 요청 엔드포인트
 * @param question - 전달할 질문 데이터 (문자열 또는 JSON)
 * @returns API 응답에서 추출한 답변
 */
const sendChatMessage = async (endpoint: string, question: string): Promise<string> => {
    try {
        const requestBody = { question }; // 질문 데이터를 공통 구조로 만듦
        const headers = getAuthHeaders('Bearer'); // Bearer 토큰 추가
        const response = await api.post(endpoint, requestBody, { headers });
        return response.data.answer; // 응답에서 "answer" 값만 반환
    } catch (error: any) {
        throw handleApiError(error, `${endpoint} 요청 중 오류가 발생했습니다.`);
    }
};

// 일반 질의
export const sendGeneralChatMsg = async (message: string): Promise<string> => {
    return sendChatMessage('/chat/general/questions', message); // 일반 질의 엔드포인트
};

// 레시피 추천
export const sendRecipeChatMsg = async (message: string): Promise<string> => {
    return sendChatMessage('/chat/recipes/questions', message); // 레시피 추천 엔드포인트
};

// 모든 메시지 조회