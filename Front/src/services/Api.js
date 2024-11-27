// src/services/Api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

let isRefreshing = false;

const removeTokens = async () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const logout = async (isSessionExpired = false) => {
  let accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!accessToken || !refreshToken) {
    removeTokens();
    return { success: false, message: isSessionExpired ? '세션이 만료되었습니다.' : '로그아웃 실패' };
  }

  try {
    const newAccessToken = await refreshAccessToken();
    accessToken = newAccessToken || accessToken;
    
    console.log(encodeURIComponent(refreshToken));
    const response = await api.post(
      `/auth/logout?refreshToken=${encodeURIComponent(refreshToken)}`, 
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    
    removeTokens();
    return { success: true, message: response.message };
  } catch (error) {
    const errorMessage =
      error.response?.status === 403
        ? '권한이 없어 로그아웃에 실패했습니다.'
        : '로그아웃 요청이 실패했습니다.';
    return { success: false, message: errorMessage };
  }
};

export const refreshAccessToken = async () => {
  if (isRefreshing) return null;

  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    console.warn('Refresh Token이 없습니다.');
    return null;
  }

  isRefreshing = true;
  try {
    const response = await api.post('/auth/refresh', { refreshToken });
    const newAccessToken = response.data.accessToken;
    localStorage.setItem('accessToken', newAccessToken);
    return newAccessToken;
  } catch (err) {
    console.error('Access Token 갱신 실패:', err.response?.data || err.message);
    return null;
  } finally {
    isRefreshing = false;
  }
};


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // HTTP 401 처리
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 재요청 방지 플래그 설정

      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // 갱신된 토큰으로 재요청
      }

      // Refresh Token도 만료된 경우
      await logout(true);
    };

    return Promise.reject(error); // 다른 에러는 그대로 반환
  }
);

export default api;
