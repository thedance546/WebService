package com.example.loginDemo.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final RedisTemplate<String, Object> redisTemplate;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain
    ) throws ServletException, IOException {

        final String jwt = extractJwtFromHeader(request);
        final String userEmail = jwt != null ? jwtService.extractUsername(jwt) : null;

        // 토큰 검증
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // JWT 토큰 추출
            String tokenType = jwtService.extractClaim(jwt, claims -> claims.get("type", String.class));

            // 블랙리스트에 토큰이 있는지 확인
            if (isTokenBlacklisted(jwt)) {
                setUnauthorizedResponse(response, "Token is blacklisted", tokenType);
                return;
            }

            // Access, Refresh 검증
            if ("access".equals(tokenType)) {
                if (!jwtService.isTokenValid(jwt, userDetails)) {
                    setUnauthorizedResponse(response, "Access token is expired or invalid", "access");
                    return;
                }
            } else if ("refresh".equals(tokenType)) {
                if (jwtService.isTokenExpired(jwt)) {
                    setUnauthorizedResponse(response, "Refresh token is expired", "refresh");
                    return;
                }
            }
            // 토큰이 유효하다면, SecurityContext에 인증 정보를 세팅
            setAuthenticationContext(userDetails, request);
        }
        filterChain.doFilter(request, response);
    }

    private String extractJwtFromHeader(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        return (authHeader != null && authHeader.startsWith("Bearer ")) ? authHeader.substring(7) : null;
    }

    private void setUnauthorizedResponse(HttpServletResponse response, String message, String tokenType) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
        response.setContentType("application/json");
        String jsonResponse = String.format("{\"message\": \"%s\", \"tokenType\": \"%s\"}", message, tokenType);
        response.getWriter().write(jsonResponse);
    }


    private void setAuthenticationContext(UserDetails userDetails, HttpServletRequest request) {
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities()
        );
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private boolean isTokenBlacklisted(String token) {
        return redisTemplate.hasKey("blacklist:" + token);  // 블랙리스트에 토큰이 있으면 true 반환
    }


}

