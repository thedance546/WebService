// src/services/AuthApi.ts

import { api, getAuthHeaders } from './Api';
import { setAccessToken, clearAccessToken } from './TokenManager';
import { handleApiError } from '../utils/Utils';

export const register = async (email: string, username: string, password: string): Promise<string> => {
  try {
    const response = await api.post('/auth/register', { email, username, password });
    console.log("회원가입 성공:", response.data.message);
    return response.data.message;
  } catch (error: any) {
    console.error("회원가입 중 오류 발생:", error);
    throw handleApiError(error, "회원가입 중 오류 발생");
  }
};

export const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
  console.log("로그인 요청 시작...");
  try {
    const response = await api.post('/auth/authenticate', { email, password });
    const { accessToken } = response.data;

    if (accessToken) {
      setAccessToken(accessToken);
      console.log("로그인 성공: Access Token 설정됨");
      return { success: true, message: '로그인 성공' };
    } else {
      console.error("로그인 실패: Access Token이 없음");
      return { success: false, message: '로그인 실패: Access Token이 없음' };
    }
  } catch (error: any) {
    console.error("로그인 요청 실패:", error);
    throw handleApiError(error, '로그인 실패');
  }
};

export const logout = async (): Promise<{ success: boolean; message: string }> => {
  console.log("로그아웃 요청 시작...");
  try {
    const headers = getAuthHeaders('Bearer');
    const response = await api.post(
      '/auth/logout',
      {},
      {
        withCredentials: true,
        headers,
      }
    );

    clearAccessToken();
    console.log("로그아웃 성공: 서버 세션 종료 및 로컬 토큰 제거");
    return { success: true, message: response.data.message };
  } catch (error: any) {
    console.error("로그아웃 요청 실패:", error);

    clearAccessToken();
    const isUnauthorized = error.response?.status === 401;
    return {
      success: !isUnauthorized,
      message: handleApiError(
        error,
        isUnauthorized
          ? '로그아웃 중 토큰이 만료되었습니다.'
          : '로그아웃 요청이 실패했습니다.'
      ).message,
    };
  }
};

export const deleteAccount = async (): Promise<{ success: boolean; message: string }> => {
  console.log("회원탈퇴 요청 시작...");
  try {
    const headers = getAuthHeaders('Bearer');
    const response = await api.delete('/auth/delete-account', { headers });

    console.log("회원탈퇴 성공:", response.data.message);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    console.error("회원탈퇴 요청 실패:", error);
    return { success: false, message: handleApiError(error, "회원탈퇴 요청이 실패했습니다.").message };
  }
};
