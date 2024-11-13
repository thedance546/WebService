package com.example.loginDemo.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class LogoutService {

    private final JwtService jwtService;
    private final BlacklistService blacklistService;

    public void logout(String accessToken, String refreshToken) {
        long accessTokenExpiration = jwtService.extractExpiration(accessToken).getTime() - System.currentTimeMillis();
        long refreshTokenExpiration = jwtService.extractExpiration(refreshToken).getTime() - System.currentTimeMillis();

        // 블랙리스트에 추가
        blacklistService.addToBlacklist(accessToken, accessTokenExpiration);
        blacklistService.addToBlacklist(refreshToken, refreshTokenExpiration);
    }
}
