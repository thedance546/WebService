package com.example.loginDemo.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class BlacklistService {
    private final RedisTemplate<String, Object> redisTemplate;

    public void addToBlacklist(String token, long expirationTime) {
        redisTemplate.opsForValue().set("blacklist:" + token, token, expirationTime, TimeUnit.MILLISECONDS);
    }

    public boolean isTokenBlacklisted(String token) {
        return redisTemplate.hasKey("blacklist:" + token);
    }
}
