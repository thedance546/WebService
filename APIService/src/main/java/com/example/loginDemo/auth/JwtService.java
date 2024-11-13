package com.example.loginDemo.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JwtService {

    @Value("${security.secret.key}")
    private String secret_key;

    private final BlacklistService blacklistService; // BlacklistService 의존성 주입

    private static final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 60; // 1 hour
    private static final long REFRESH_TOKEN_EXPIRATION = 1000 * 60 * 60 * 24 * 7; //7 days

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateAccessToken(UserDetails userDetails) {
        return generateAccessToken(new HashMap<>(), userDetails, "access");  // type = access
    }

    public String generateAccessToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            String tokenType // 추가된 tokenType 파라미터
    ){
        extraClaims.put("type", tokenType);  // "type" 클레임 추가
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis())) // 토큰 발행 시간
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION)) // 만료 시간
                .signWith(getSignInKey(), SignatureAlgorithm.HS256) // 토큰 알고리즘
                .compact();
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return generateRefreshToken(new HashMap<>(), userDetails, "refresh");  // type = refresh
    }

    public String generateRefreshToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            String tokenType // 추가된 tokenType 파라미터
    ) {
        extraClaims.put("type", tokenType);  // "type" 클레임 추가
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis())) // 토큰 발행 시간
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION)) // 만료 시간
                .signWith(getSignInKey(), SignatureAlgorithm.HS256) // 토큰 알고리즘
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        if (isTokenExpired(token)) {
            return false;
        }
        if (isTokenBlacklisted(token)) {
            return false;
        }

        String username = extractUsername(token);
        return username.equals(userDetails.getUsername());
    }


    protected boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    protected Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret_key);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // 블랙리스트에 있는지 확인하는 메서드
    public boolean isTokenBlacklisted(String token) {
        return blacklistService.isTokenBlacklisted(token);
    }
}
