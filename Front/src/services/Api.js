// src/services/Api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// 회원가입 API
export const register = async (email, username, password) => {
  try {
    const response =
    await api.post('/auth/register', { email, username, password });
    return response.data.message;
  } catch (error) {
    throw error.response?.data?.message || '회원가입 중 오류 발생';
  }
};

// 로그인 API
export const login = async (email, password) => {
  try {
    const response =
    await api.post('/auth/authenticate', { email, password });
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
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!accessToken || !refreshToken) {
    return { success: false, message: '로그아웃 실패' };
  }

  try {
    const response = await api.post(
      `/auth/logout?refreshToken=${encodeURIComponent(refreshToken)}`,
      {}, // 본문이 아닌 쿼리에 포함된 형태로 전달
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return { success: true, message: response.data.message };
  } catch (error) {
    const errorMessage =
      error.response?.status === 403
        ? '권한이 없어 로그아웃에 실패했습니다.'
        : '로그아웃 요청이 실패했습니다.';
    return { success: false, message: errorMessage };
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

    return { success: true, message: response.message };
  } catch (error) {
    const errorMessage =
      error.response?.status === 403
        ? '권한이 없어 회원탈퇴에 실패했습니다.'
        : '회원탈퇴 요청이 실패했습니다.';
    return { success: false, message: errorMessage };
  }
};

export default api;
