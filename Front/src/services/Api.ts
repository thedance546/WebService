// src/services/Api.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAccessToken, refreshAccessToken } from './TokenManager';
import { handleApiError } from '../utils/Utils';

export const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

// Authorization Header 생성 함수
export const getAuthHeaders = (headerString: string): { Authorization: string } => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) throw new Error("Access Token이 설정되지 않았습니다.");
    return { Authorization: `${headerString} ${accessToken}` };
  } catch (error: any) {
    throw handleApiError(error, 'Access Token이 설정되지 않았습니다.');
  }
};

// Axios 응답 인터셉터 - Access Token 갱신 로직
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest: AxiosRequestConfig & { _retry?: boolean } = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken(api);
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
