// src/services/Api.js
import axios from 'axios';
import { getAccessToken, refreshAccessToken } from './TokenManager';
import { handleApiError } from '../utils/Utils';

export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

  // Authorization Header 생성 함수
  export const getAuthHeaders = (headerString) => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken)
        return { Authorization: `${headerString} ${accessToken}` };
      } catch (error) {
        throw handleApiError(error, 'Access Token이 설정되지 않았습니다.');
      }
  };

// Axios 응답 인터셉터 - Access Token 갱신 로직
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken(api);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
