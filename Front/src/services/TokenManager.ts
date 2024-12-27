// src/services/TokenManager.ts

import { handleApiError } from '../utils/Utils';

let accessToken: string = "";

export const setAccessToken = (token: string): void => {
  accessToken = token;
};

export const getAccessToken = (): string => accessToken;

export const clearAccessToken = (): void => {
  accessToken = "";
};

// Access Token 갱신 함수
export const refreshAccessToken = async (api: any): Promise<string> => {
  try {
    const response = await api.post('/auth/refresh', {});
    const newAccessToken: string = response.data.accessToken;

    setAccessToken(newAccessToken);

    return newAccessToken;
  } catch (error: any) {
    clearAccessToken();
    throw handleApiError(error, '로그인이 필요합니다.');
  }
};
