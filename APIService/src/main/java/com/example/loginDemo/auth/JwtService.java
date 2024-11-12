package com.example.loginDemo.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${security.secret.key}")
    private String secretKey;

    public final static long ACCESS_TOKEN_VALIDATION_SECOND = 1000 * 60 * 30; // 30분
    public final static long REFRESH_TOKEN_VALIDATION_SECOND = 1000 * 60 * 60 * 24 * 14; // 14일

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Access Token 생성 메서드
    public String generateAccessToken(UserDetails userDetails) {
            Map<String, Object> extraClaims = new HashMap<>();
            extraClaims.put("type", "access");
            return generateAccessToken(extraClaims, userDetails);
        }

        public String generateAccessToken(
                Map<String, Object> extraClaims,
                UserDetails userDetails
    ){
            return Jwts
                    .builder()
                    .setClaims(extraClaims)
                    .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis())) // 토큰 발행 시간
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_VALIDATION_SECOND))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256) // 토큰 알고리즘
                .compact();
    }

    // Refresh Token 생성 메서드
    public String generateRefreshToken(UserDetails userDetails) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("type", "refresh");
        return generateRefreshToken(extraClaims, userDetails);
    }

    public String generateRefreshToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails
    ) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername()) // 토큰의 subject는 사용자 이름
                .setIssuedAt(new Date(System.currentTimeMillis())) // 발행 시간
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_VALIDATION_SECOND))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256) // 서명
                .compact();
    }

    public boolean isAccessToken(String token) {
        // 토큰에서 "type" 클레임 추출
        String tokenType = extractClaim(token, claims -> claims.get("type", String.class));

        // "access"라는 type을 가진 토큰이 access_token
        return "access".equals(tokenType);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()  // Then build the parser
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }


    private Key getSignInKeyForAccessToken() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
