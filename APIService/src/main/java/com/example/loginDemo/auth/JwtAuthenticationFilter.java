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

    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NotNull HttpServletRequest request,
            @NotNull HttpServletResponse response,
            @NotNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String jwt = extractJwtFromRequest(request);

        if (jwt == null) {
            filterChain.doFilter(request, response);
            return;
        }

        if (jwtService.isAccessToken(jwt)) {
            // Access Token의 경우
            String userEmail = jwtService.extractUsername(jwt);
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                //유효성 검사
                if (validateToken(jwt, userDetails, response, "Access-Token-Expired")) {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } else {
            // Refresh Token의 경우
            String username = jwtService.extractUsername(jwt);
            if (username != null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // 리프레시 토큰이 유효한지 확인
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    // 리프레시 토큰이 유효하면 새로운 액세스 토큰 발급
                    String newAccessToken = jwtService.generateAccessToken(userDetails);
                    response.setHeader("New-Access-Token", newAccessToken); // 새로운 액세스 토큰을 응답 헤더에 추가
                } else {
                    // 리프레시 토큰이 만료된 경우, 클라이언트는 다시 로그인해야 함
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setHeader("Token-Status", "Refresh-Token-Expired");// 401 Unauthorized
                    response.getWriter().write("Refresh token is expired or invalid");
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private String extractJwtFromRequest(HttpServletRequest request) {
        final String authHeader = request.getHeader(AUTHORIZATION_HEADER);
        if (authHeader != null && authHeader.startsWith(BEARER_PREFIX)) {
            return authHeader.substring(BEARER_PREFIX.length());
        }
        return null;
    }

    private boolean validateToken(String jwt, UserDetails userDetails, HttpServletResponse response, String tokenStatusHeader) throws IOException {
        if (!jwtService.isTokenValid(jwt, userDetails)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setHeader("Token-Status", tokenStatusHeader);
            response.getWriter().write(tokenStatusHeader.equals("Access-Token-Expired") ?
                    "JWT token is expired or invalid" : "Refresh token is expired or invalid");
            return false;
        }
        return true;
    }
}
