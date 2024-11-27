// src/services/Api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

let isRefreshing = false;

// 회원가입 API
export const register = async (email, username, password) => {
  try {
    const response = await api.post(
      '/auth/register',
      { email, username, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.message;
  } catch (error) {
    throw error.response?.data?.message || '회원가입 중 오류 발생';
  }
};

// 로그인 API
export const login = async (email, password) => {
  try {
    const response = await api.post(
      '/auth/authenticate',
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const { accessToken, refreshToken } = response.data;

    // 토큰 저장 (local Storage - 임시)
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    return { success: true, message: '로그인 성공' };
  } catch (error) {
    throw error.response?.data?.message || '로그인 실패';
  }
};

// 로그아웃 API
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

// 액세스 토큰 갱신
export const refreshAccessToken = async () => {
  if (isRefreshing) return null;

  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;

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

// 회원탈퇴 API
export const deleteAccount = async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return { success: false, message: '로그인이 필요합니다.' };

  try {
    const response = await api.delete('/auth/delete-account', {
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

// Axios 요청 인터셉터 (액세스 토큰 추가)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Axios 응답 인터셉터 (401 처리)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
