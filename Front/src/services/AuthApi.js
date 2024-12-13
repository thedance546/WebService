// src/services/AuthApi.js
import { api, getAuthHeaders, handleApiError } from './Api';

// 회원가입 API
export const register = async (email, username, password) => {
  try {
    const response = await api.post('/auth/register', { email, username, password });
    return response.data.message;
  } catch (error) {
    throw handleApiError(error, "회원가입 중 오류 발생");
  }
};

// 로그인 API
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/authenticate', { email, password });
    const { accessToken, refreshToken } = response.data;

    // 토큰 저장 (임시, 로컬스토리지)
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    return { success: !!accessToken, message: "로그인 성공" };
  } catch (error) {
    throw handleApiError(error, "로그인 실패");
  }
};

// 로그아웃 API
export const logout = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    return { success: false, message: "로그아웃 실패: Refresh Token이 없습니다." };
  }

  try {
    const response = await api.post(
      `/auth/logout?refreshToken=${encodeURIComponent(refreshToken)}`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );

    return { success: true, message: response.data.message };
  } catch (error) {
    return { success: false, message: handleApiError(error, "로그아웃 요청이 실패했습니다.").message };
  }
};

// 회원탈퇴 API
export const deleteAccount = async () => {
  try {
    const response = await api.delete('/auth/delete-account', {
      headers: getAuthHeaders(),
    });

    return { success: true, message: response.data.message };
  } catch (error) {
    return { success: false, message: handleApiError(error, "회원탈퇴 요청이 실패했습니다.").message };
  }
};
