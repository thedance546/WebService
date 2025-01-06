// src/services/TokenManager.ts

import { api } from './Api';
import { handleApiError } from '../utils/Utils';

const TOKEN_KEY = 'accessToken'; // Local Storage 키

export const setAccessToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  console.log("Access Token 설정됨:", token);
};

export const getAccessToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  console.log("현재 Access Token:", token || "없음");
  return token || null; // 없을 경우 null 반환
};

export const clearAccessToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  console.log("Access Token 초기화됨");
};

// Access Token 갱신 함수
export const refreshAccessToken = async (): Promise<string> => {
  const accessToken = getAccessToken();

  // 액세스 토큰이 없으면 갱신 시도 중단
  if (!accessToken) {
    console.warn("갱신 시도 중단: 유효한 액세스 토큰이 없음.");
    throw new Error("유효한 액세스 토큰 없음");
  }

  console.log("토큰 갱신 요청 시작...");
  try {
    const response = await api.post('/auth/refresh', {}, { withCredentials: true });
    const newAccessToken: string = response.data.accessToken;

    setAccessToken(newAccessToken);
    console.log("토큰 갱신 성공:", newAccessToken);
    return newAccessToken;
  } catch (error: any) {
    console.error("토큰 갱신 실패:", error.message || error);
    clearAccessToken();
    throw handleApiError(error, '토큰 갱신 실패: 로그인이 필요합니다.');
  }
};
