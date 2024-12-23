// src/services/AuthApi.ts

import { api, getAuthHeaders } from './Api';
import { setAccessToken, clearAccessToken } from './TokenManager';
import { handleApiError } from '../utils/Utils';

export const register = async (email: string, username: string, password: string): Promise<string> => {
  try {
    const response = await api.post('/auth/register', { email, username, password });
    return response.data.message;
  } catch (error: any) {
    throw handleApiError(error, "회원가입 중 오류 발생");
  }
};

export const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post('/auth/authenticate', { email, password });
    const { accessToken } = response.data;
    setAccessToken(accessToken);
    return { success: !!accessToken, message: '로그인 성공' };
  } catch (error: any) {
    throw handleApiError(error, '로그인 실패');
  }
};

export const logout = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post('/auth/logout', { refreshToken: true }, { headers: getAuthHeaders('Bearer') });
    clearAccessToken();
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { success: false, message: handleApiError(error, '로그아웃 요청이 실패했습니다.').message };
  }
};

export const deleteAccount = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete('/auth/delete-account', {
      headers: getAuthHeaders('Bearer'),
    });
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { success: false, message: handleApiError(error, "회원탈퇴 요청이 실패했습니다.").message };
  }
};
