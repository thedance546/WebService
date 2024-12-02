package com.example.loginDemo.auth;

import com.example.loginDemo.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtService jwtService;
    private final LogoutService logoutService;
    private final UserDetailsService userDetailsService;

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
        accessToken = extractToken(accessToken);
        logoutService.logout(accessToken, refreshToken);
        return ResponseEntity.ok("Successfully logged out");
    }

    @DeleteMapping("/delete-account")
    public ResponseEntity<Map<String, String>> deleteAccount(@RequestHeader("Authorization") String accessToken) {
        accessToken = extractToken(accessToken);
        Map<String, String> response = authService.deleteAccount(accessToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refreshAccessToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");

        if (jwtService.isTokenExpired(refreshToken)) {
            return ResponseEntity.status(401).body(Map.of(
                    "message", "Refresh token is expired",
                    "tokenType", "refresh"
            ));
        }

        String userEmail = jwtService.extractUsername(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
        String newAccessToken = jwtService.generateAccessToken(userDetails, userDetails.getAuthorities().toString());

        return ResponseEntity.ok(Map.of(
                "accessToken", newAccessToken
        ));
    }

    private String extractToken(String token) {
        return token.substring(7); // Assuming "Bearer " prefix
    }



}
