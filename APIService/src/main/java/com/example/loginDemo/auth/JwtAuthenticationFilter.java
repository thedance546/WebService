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

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";
    private static final String ACCESS_TOKEN = "access";
    private static final String REFRESH_TOKEN = "refresh";

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final RedisTemplate<String, Object> redisTemplate;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain
    ) throws ServletException, IOException {

        final String jwt = extractJwtFromHeader(request);
        final String userEmail = jwt != null ? jwtService.extractUsername(jwt) : null;

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            String tokenType = jwtService.extractClaim(jwt, claims -> claims.get("type", String.class));

            if (isTokenBlacklisted(jwt)) {
                sendUnauthorizedResponse(response, "Token is blacklisted", tokenType);
                return;
            }

            if (!isTokenValid(jwt, tokenType, userDetails)) {
                sendUnauthorizedResponse(response, tokenType.equals(ACCESS_TOKEN) ?
                        "Access token is expired or invalid" : "Refresh token is expired", tokenType);
                return;
            }

            setAuthenticationContext(userDetails, request);
        }
        filterChain.doFilter(request, response);
    }

    //methods

    private String extractJwtFromHeader(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        return (authHeader != null && authHeader.startsWith("Bearer ")) ? authHeader.substring(7) : null;
    }

    private boolean isTokenValid(String jwt, String tokenType, UserDetails userDetails) {
        if (ACCESS_TOKEN.equals(tokenType)) {
            return jwtService.isTokenValid(jwt, userDetails);
        } else if (REFRESH_TOKEN.equals(tokenType)) {
            return !jwtService.isTokenExpired(jwt);
        }
        return false;
    }

    private void sendUnauthorizedResponse(HttpServletResponse response, String message, String tokenType) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
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
        return redisTemplate.hasKey("blacklist:" + token);
    }


}

