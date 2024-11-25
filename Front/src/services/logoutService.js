// src/services/logoutService.js
export const logoutService = () => {
    // 토큰 제거
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // 알림
    alert("로그아웃 되었습니다.");
};