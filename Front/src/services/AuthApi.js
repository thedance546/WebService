// src/services/AuthApi.js
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

// Refresh Access Token을 위한 함수
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error("Refresh token이 존재하지 않습니다.");
  }

  try {
    const response = await api.post('/auth/refresh-token', {
      refreshToken: refreshToken,
    });
    return response.data.accessToken;
  } catch (error) {
    throw new Error("액세스 토큰 갱신 중 오류가 발생했습니다.");
  }
};

// Axios 인터셉터 설정 - 401 에러 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러가 발생한 경우, 토큰 갱신을 시도
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        localStorage.setItem('accessToken', newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // 갱신된 토큰으로 원래의 요청을 재시도
        return api(originalRequest);
      } catch (refreshError) {
        // 갱신이 실패한 경우, 예를 들어 refresh token이 만료된 경우
        console.error('토큰 갱신 실패:', refreshError);
        window.location.href = '/login'; // 인증 실패 시 로그인 페이지로 리다이렉트
      }
    }

    // 다른 에러에 대해서는 원래의 에러를 반환
    return Promise.reject(error);
  }
);

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

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    return { success: true, message: "로그인 성공" };
  } catch (error) {
    throw handleApiError(error, "로그인 실패");
  }
};

// 로그아웃 API
export const logout = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    return { success: false, message: "로그아웃 실패" };
  }

  try {
    const response = await api.post(
      `/auth/logout?refreshToken=${encodeURIComponent(refreshToken)}`,
      {},
      { headers: getAuthHeaders() }
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
