// src/services/TokenManager.ts

import { api } from './Api';
import { handleApiError } from '../utils/Utils';

let accessToken: string = "";

export const setAccessToken = (token: string): void => {
  accessToken = token;
  console.log("Access Token 설정됨:", token);
};

export const getAccessToken = (): string => {
  console.log("현재 Access Token:", accessToken || "없음");
  return accessToken;
};

export const clearAccessToken = (): void => {
  accessToken = "";
  console.log("Access Token 초기화됨");
};

// Access Token 갱신 함수
export const refreshAccessToken = async (): Promise<string> => {
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