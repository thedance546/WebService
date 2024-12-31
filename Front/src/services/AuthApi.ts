// src/services/AuthApi.ts

import { api, getAuthHeaders } from './Api';
import { setAccessToken, clearAccessToken, getAccessToken } from './TokenManager';
import { handleApiError } from '../utils/Utils';

export const register = async (email: string, username: string, password: string): Promise<string> => {
  try {
    const response = await api.post('/auth/register', { email, username, password });
    console.debug("회원가입 성공:", response.data.message);
    return response.data.message;
  } catch (error: any) {
    console.error("회원가입 중 오류 발생:", error);
    throw handleApiError(error, "회원가입 중 오류 발생");
  }
};

export const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
  console.debug("로그인 요청 시작...");
  try {
    const response = await api.post('/auth/authenticate', { email, password });
    const { accessToken } = response.data;

    if (accessToken) {
      setAccessToken(accessToken);
      console.debug("로그인 성공: Access Token 설정됨");
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
  console.debug("로그아웃 요청 시작...");

  try {
    const accessToken = getAccessToken();

    if (!accessToken) {
      console.warn("Access Token이 설정되지 않음: 로그아웃 요청 생략");
      return { success: false, message: 'Access Token이 설정되지 않았습니다.' };
    }

    const headers = getAuthHeaders('Bearer');
    const response = await api.post(
      '/auth/logout',
      {},
      {
        withCredentials: true, // Refresh Token은 쿠키에서 처리
        headers,
      }
    );

    clearAccessToken();
    console.debug("로그아웃 성공: Access Token 및 Refresh Token 제거됨");

    return { success: true, message: response.data.message };
  } catch (error: any) {
    console.error("로그아웃 요청 실패:", error);

    clearAccessToken();
    return { success: false, message: handleApiError(error, '로그아웃 요청이 실패했습니다.').message };
  }
};

export const deleteAccount = async (): Promise<{ success: boolean; message: string }> => {
  console.debug("회원탈퇴 요청 시작...");
  try {
    const headers = getAuthHeaders('Bearer');
    const response = await api.delete('/auth/delete-account', { headers });

    console.debug("회원탈퇴 성공:", response.data.message);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    console.error("회원탈퇴 요청 실패:", error);
    return { success: false, message: handleApiError(error, "회원탈퇴 요청이 실패했습니다.").message };
  }
};
