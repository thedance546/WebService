package com.example.loginDemo.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
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

    @Override
    protected void doFilterInternal(
            @NotNull HttpServletRequest request,
            @NotNull HttpServletResponse response,
            @NotNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String jwt = extractJwtFromHeader(request);
        final String userEmail = jwt != null ? jwtService.extractUsername(jwt) : null;

        // 토큰 검증
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // JWT 토큰의 타입 추출
            String tokenType = jwtService.extractClaim(jwt, claims -> claims.get("type", String.class));

            // Access token 검증
            if ("access".equals(tokenType)) {
                if (!jwtService.isTokenValid(jwt, userDetails)) {
                    setUnauthorizedResponse(response, "Access token is expired or invalid", "access");
                    return;
                }
            } else if ("refresh".equals(tokenType)) {
                // Refresh token 검증
                if (jwtService.isTokenExpired(jwt)) {
                    setUnauthorizedResponse(response, "Refresh token is expired", "refresh");
                    return;
                }
            }

            // 토큰이 유효하다면, SecurityContext에 인증 정보를 세팅
            setAuthenticationContext(userDetails, request);
        }

        // 필터 체인 계속 진행
        filterChain.doFilter(request, response);
    }

    private String extractJwtFromHeader(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        return (authHeader != null && authHeader.startsWith("Bearer ")) ? authHeader.substring(7) : null;
    }

    private void setUnauthorizedResponse(HttpServletResponse response, String message, String tokenType) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 Unauthorized 상태 코드
        response.setContentType("application/json");
        response.getWriter().write("{\"message\": \"" + message + "\", \"tokenType\": \"" + tokenType + "\"}");
    }


    private void setAuthenticationContext(UserDetails userDetails, HttpServletRequest request) {
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities()
        );
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

}

