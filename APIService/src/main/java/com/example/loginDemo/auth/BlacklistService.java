package com.example.loginDemo.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class BlacklistService {
    private final RedisTemplate<String, Object> redisTemplate;

    // 토큰을 블랙리스트에 추가하는 메서드
    public void addToBlacklist(String token, long expirationTime, String actionType) {
        redisTemplate.opsForValue().set("blacklist:" + token, actionType, expirationTime, TimeUnit.MILLISECONDS);
    }

    // 토큰이 블랙리스트에 있는지 확인하는 메서드
    public boolean isTokenBlacklisted(String token) {
        return redisTemplate.hasKey("blacklist:" + token);
    }
}
