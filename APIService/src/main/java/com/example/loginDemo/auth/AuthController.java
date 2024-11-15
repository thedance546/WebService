package com.example.loginDemo.auth;

import com.example.loginDemo.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final LogoutService logoutService;

    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request){
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String accessToken,
                                    @RequestParam("refreshToken") String refreshToken) {
        accessToken = accessToken.substring(7);
        logoutService.logout(accessToken, refreshToken); // 두 토큰 모두 블랙리스트에 추가
        return ResponseEntity.ok("Successfully logged out");
    }

    @DeleteMapping("/delete-account")
    public ResponseEntity<Map<String, String>> deleteAccount(@RequestHeader("Authorization") String accessToken) {
        accessToken = accessToken.substring(7); // "Bearer " 부분 제거
        Map<String, String> response = authService.deleteAccount(accessToken); // deleteAccount 메서드 호출
        return ResponseEntity.ok(response);
    }



}
