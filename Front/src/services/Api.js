// Services/Api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// 요청 시 Authorization 헤더 설정
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response, // 응답이 성공적일 경우 그대로 반환
  async (error) => { // 에러가 발생한 경우 처리
    const originalRequest = error.config;

    // 조건: HTTP 상태 코드가 401(Unauthorized)이고, 이전에 요청을 재시도한 적이 없는 경우
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 재시도를 방지하기 위해 플래그 설정
      try {
        // Refresh Token을 로컬 스토리지에서 가져옴
        const refreshToken = localStorage.getItem('refreshToken');

        // Refresh Token을 사용해 새로운 Access Token 요청
        const response = await api.post('/auth/refresh', { refreshToken });

        // 새로 발급된 Access Token 저장
        const newAccessToken = response.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        // 원래 요청의 Authorization 헤더를 새 Access Token으로 갱신
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 원래 요청을 새 Access Token으로 재시도
        return api(originalRequest);
      } catch (err) {
        console.error("Failed to refresh token", err);

        // 갱신 실패 시, Refresh Token 및 Access Token 삭제
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // 사용자 로그아웃 및 로그인 페이지로 리다이렉트
        window.location.href = '/login';
      }
    }
    return Promise.reject(error); // 갱신 실패 또는 다른 에러는 그대로 반환
  }
);


// 로그아웃 함수
export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');
    
    await api.post(
      '/auth/logout',
      { refreshToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // 로그아웃 후 Welcome 화면으로 이동
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/'; // Welcome 화면으로 이동
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export default api;
