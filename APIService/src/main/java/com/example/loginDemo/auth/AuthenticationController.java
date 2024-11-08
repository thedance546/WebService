package com.example.loginDemo.auth;

import com.example.loginDemo.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }


    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request){
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshAccessToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        String refreshToken = refreshTokenRequest.getRefreshToken();

        // Refresh Token이 null이면 처리
        if (refreshToken == null) {
            return ResponseEntity.status(400).body("Refresh token is required");
        }

        // Refresh Token에서 username 추출
        String username = jwtService.extractUsername(refreshToken);

        // UserDetails 로드
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        if (userDetails == null) {
            return ResponseEntity.status(401).body("User not found");
        }

        // Refresh Token이 유효한지 확인
        if (!jwtService.isTokenValid(refreshToken, userDetails)) {
            return ResponseEntity.status(401).body("Invalid or expired refresh token");
        }

        // 새로운 Access Token 발급 (UserDetails를 전달)
        String newAccessToken = jwtService.generateAccessToken(userDetails);

        // 새로운 Access Token을 응답에 포함하여 반환
        return ResponseEntity.ok(new AccessTokenResponse(newAccessToken));
    }

}
