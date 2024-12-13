// src/services/Api.js
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// 공통적으로 사용할 Authorization Header를 포함하는 함수
export const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('accessToken');
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

// 공통적인 에러 핸들링 함수
export const handleApiError = (error, defaultMessage) => {
  if (error.response?.data?.message) {
    return new Error(error.response.data.message);
  }
  return new Error(defaultMessage);
};
