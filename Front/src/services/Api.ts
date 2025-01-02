// src/services/Api.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAccessToken, refreshAccessToken } from './TokenManager';

export const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

// Authorization Header 생성 함수
export const getAuthHeaders = (headerString: string): { Authorization?: string } => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    console.warn("Access Token이 설정되지 않았습니다. 요청은 Refresh Token에 의존합니다.");
    return {};
  }
  return { Authorization: `${headerString} ${accessToken}` };
};

// Axios 응답 인터셉터 - Access Token 갱신 로직
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest: AxiosRequestConfig & { _retry?: boolean } = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return api(originalRequest);
      } catch (refreshError) {
        console.error("갱신 실패로 요청을 종료합니다.");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
