// src/services/Api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

let isRefreshing = false;

export const register = async (email, username, password) => {
  try {
    const response = await api.post("/auth/register", {
      email,
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("회원가입 실패:", error.response?.data || error.message);
    throw error;
  }
};

export const logout = async () => {
  let accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!accessToken || !refreshToken) {
    return { success: false, message: '로그아웃 실패' };
  }

  try {
    const response = await api.post(
      `/auth/logout?refreshToken=${encodeURIComponent(refreshToken)}`, {},
      { headers: { Authorization: `Bearer ${accessToken}` }, }
    );

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

export const deleteAccount = async () => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    return { success: false, message: '로그인이 필요합니다.' };
  }

  try {
    const response = await api.delete('/api/auth/delete-account', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    console.log('회원탈퇴 성공:', response.message);
    return { success: true, message: '회원탈퇴가 완료되었습니다.' };
  } catch (error) {
    console.error('회원탈퇴 실패:', error.response?.status, error.response?.data);

    const errorMessage =
      error.response?.status === 403
        ? '권한이 없어 회원탈퇴에 실패했습니다.'
        : '회원탈퇴 요청이 실패했습니다.';
    return { success: false, message: errorMessage };
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
