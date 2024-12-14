// src/services/Api.js
import axios from 'axios';
import { getAccessToken, refreshAccessToken } from './TokenManager';

export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

// Authorization Header 생성 함수
export const getAuthHeaders = () => {
  const accessToken = getAccessToken();
  if (!accessToken)
    throw new Error('Access Token이 설정되지 않았습니다.');
  
  return { Authorization: `Bearer ${accessToken}` };
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

// 공통적인 에러 핸들링 함수
export const handleApiError = (error, defaultMessage) => {
  if (error.response?.data?.message) {
    return new Error(error.response.data.message);
  }
  return new Error(defaultMessage);
};