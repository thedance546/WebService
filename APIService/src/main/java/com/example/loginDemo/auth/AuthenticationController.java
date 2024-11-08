package com.example.loginDemo.auth;

import com.example.loginDemo.dto.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

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

    // 리프레시 토큰을 이용해 새로운 액세스 토큰을 발급하는 테스트용 엔드포인트
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String authHeader) {
        // "Bearer "로 시작하는 토큰 추출
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid refresh token format");
        }

        String refreshToken = authHeader.substring(7); // "Bearer " 뒤의 토큰 부분만 추출
        String username = jwtService.extractUsername(refreshToken);

        if (username != null) {
            // UserDetails 로드
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // 리프레시 토큰이 유효한지 확인
            if (jwtService.isTokenValid(refreshToken, userDetails)) {
                // 새로운 액세스 토큰 발급
                String newAccessToken = jwtService.generateAccessToken(userDetails);
                return ResponseEntity.ok().header("New-Access-Token", newAccessToken).body("New access token issued");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token is expired or invalid");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
    }

}
