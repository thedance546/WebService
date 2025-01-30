package com.example.loginDemo.auth;

import com.example.loginDemo.dto.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    //회원가입
    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    // 로그인
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request, HttpServletResponse response) {
        return authService.authenticate(request, response);
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String accessToken,
                                    @CookieValue(name = "refreshToken", defaultValue = "") String refreshToken,
                                    HttpServletResponse response) {
        try {
            accessToken = extractToken(accessToken);
            authService.logout(accessToken, refreshToken, response);
            return ResponseEntity.ok("Successfully logged out");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during logout");
        }
    }

    //회원 탈퇴
    @DeleteMapping("/account")
    public ResponseEntity<Map<String, String>> deleteAccount(@RequestHeader("Authorization") String accessToken,
                                                             @CookieValue(name = "refreshToken", defaultValue = "") String refreshToken) {
        try {
            accessToken = extractToken(accessToken);
            Map<String, String> response = authService.deleteAccount(accessToken, refreshToken);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error occurred during account deletion"));
        }
    }

    // access token 갱신
    @PostMapping("/token/refresh")
    public ResponseEntity<Map<String, String>> refreshAccessToken(HttpServletRequest request) {
        return authService.refreshAccessToken(request);
    }

    private String extractToken(String token) {
        return token.substring(7); // Assuming "Bearer " prefix
    }

}
