// src/services/DetectionApi.ts
import { api, getAuthHeaders } from './Api';

export const detectObjectsInImage = async (file: File): Promise<any> => {
    if (!file.type.startsWith('image/')) {
        throw new Error('유효하지 않은 파일 형식입니다. 이미지를 업로드하세요.');
    }

    const formData = new FormData();
    formData.append('file', file);

    console.log('[Detection API] 요청 준비 완료: 파일 이름 -', file.name);

    try {
        const headers = getAuthHeaders('Bearer');
        console.log('[Detection API] 헤더 정보:', headers);

        const response = await api.post('/items/detection', formData, { headers });
        console.log('[Detection API] 서버 응답 성공:', response.data);
        return response.data; // 서버 응답을 그대로 반환
    } catch (error: any) {
        console.error('[Detection API] 이미지 탐지 요청 중 오류 발생:', error.response?.status, error.response?.data || error.message);
        throw new Error('이미지 탐지 실패. 서버와 연결에 문제가 있을 수 있습니다.');
    }
};

