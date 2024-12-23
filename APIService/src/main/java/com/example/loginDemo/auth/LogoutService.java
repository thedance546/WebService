package com.example.loginDemo.auth;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class LogoutService {

    private final JwtService jwtService;
    private final BlacklistService blacklistService;

    public void logout(String accessToken, String refreshToken, HttpServletResponse response) {
        try {
            // Access Token과 Refresh Token이 만료되었는지 확인
            if (isTokenExpired(accessToken)) {
                throw new ExpiredJwtException(null, null, "Access Token has expired");
            }

            if (isTokenExpired(refreshToken)) {
                throw new ExpiredJwtException(null, null, "Refresh Token has expired");
            }

            // Access Token과 Refresh Token의 만료 시간 추출
            long accessTokenExpiration = jwtService.extractExpiration(accessToken).getTime() - System.currentTimeMillis();
            long refreshTokenExpiration = jwtService.extractExpiration(refreshToken).getTime() - System.currentTimeMillis();

            // 블랙리스트에 Access Token과 Refresh Token 추가
            blacklistService.addToBlacklist(accessToken, accessTokenExpiration);
            blacklistService.addToBlacklist(refreshToken, refreshTokenExpiration);

            // Refresh Token을 쿠키에서 삭제 (빈 값으로 설정)
            clearRefreshToken(response);

        } catch (ExpiredJwtException e) {
            System.err.println("Error during logout: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("Error during logout: " + e.getMessage());
            e.printStackTrace();
        }
    }


    private void clearRefreshToken(HttpServletResponse response) {
        // Refresh Token을 제거하기 위해 빈 값을 가지는 쿠키로 설정
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .maxAge(0)  // 만료 시간을 0으로 설정하여 즉시 삭제
                .path("/")  // 전체 도메인에서 접근 가능
                .secure(true)  // HTTPS 연결에서만 전송
                .sameSite("None")  // 크로스 사이트 쿠키 설정
                .httpOnly(true)  // JavaScript에서 접근할 수 없도록 설정
                .build();

        response.setHeader("Set-Cookie", cookie.toString());  // 응답 헤더에 쿠키 설정
    }

    private boolean isTokenExpired(String token) {
        try {
            // JWT 만료 날짜 추출
            Date expiration = jwtService.extractExpiration(token);
            return expiration.before(new Date());
        } catch (Exception e) {
            return true; // 예외 발생 시 토큰이 유효하지 않다고 간주
        }
    }




}
