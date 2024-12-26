package com.example.loginDemo.auth;

import com.example.loginDemo.domain.Role;
import com.example.loginDemo.domain.User;
import com.example.loginDemo.dto.AuthenticationRequest;
import com.example.loginDemo.dto.RegisterRequest;
import com.example.loginDemo.exception.DuplicateEmailException;
import com.example.loginDemo.exception.InvalidEmailFormatException;
import com.example.loginDemo.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final BlacklistService blacklistService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public Map<String, String> register(RegisterRequest request) {
        validateEmail(request.getEmail());
        checkDuplicateEmail(request.getEmail());

        User user = createUser(request);
        userRepository.save(user);

        return createResponse("회원가입이 완료되었습니다.");
    }

    public void authenticate(AuthenticationRequest request, HttpServletResponse response) {
        // 인증 처리
        authenticateUser(request.getEmail(), request.getPassword());
        User user = findUserByEmail(request.getEmail());

        // Token 생성
        String accessToken = jwtService.generateAccessToken(user, user.getRole().name());
        String refreshToken = jwtService.generateRefreshToken(user, user.getRole().name());

        // 로그인 후 처리
        handleLogin(response, accessToken, refreshToken);
    }

    @Transactional
    public Map<String, String> deleteAccount(String accessToken, String refreshToken) {
        try {
            // Access Token에서 이메일 추출
            String email = jwtService.extractUsername(accessToken);
            User user = findUserByEmail(email);

            // DB에서 회원 삭제
            userRepository.delete(user);

            // Access Token과 Refresh Token을 블랙리스트에 추가
            long accessTokenExpirationTime = jwtService.extractExpiration(accessToken).getTime() - System.currentTimeMillis();
            long refreshTokenExpirationTime = jwtService.extractExpiration(refreshToken).getTime() - System.currentTimeMillis();

            // 블랙리스트에 Access Token과 Refresh Token 추가
            blacklistService.addToBlacklist(accessToken, accessTokenExpirationTime);
            blacklistService.addToBlacklist(refreshToken, refreshTokenExpirationTime);

            return createResponse("Successfully deleted the account");

        } catch (Exception e) {
            e.printStackTrace();
            return createResponse("Error occurred during account deletion");
        }
    }

    @Transactional
    public ResponseEntity<Map<String, String>> refreshAccessToken(HttpServletRequest request) {
        // 쿠키에서 Refresh Token 추출
        Cookie[] cookies = request.getCookies();
        String refreshToken = null;

        // 쿠키에서 refreshToken 찾기
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        // Refresh Token이 없거나 만료된 경우 처리
        if (refreshToken == null || jwtService.isTokenExpired(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Refresh token is expired or missing"));
        }

        // Refresh Token에서 이메일 추출
        String userEmail = jwtService.extractUsername(refreshToken);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 새로운 Access Token 생성
        String newAccessToken = jwtService.generateAccessToken(user, user.getRole().name());

        // 새로운 Access Token 반환
        return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
    }

    //Methods
    // 로그인 후 처리
    private void handleLogin(HttpServletResponse response, String accessToken, String refreshToken) {
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        response.setContentType("application/json");

        try {
            // Access Token을 JSON 응답 본문에 포함시켜 반환
            response.getWriter().write(new ObjectMapper().writeValueAsString(tokens));

            // Refresh Token을 HTTPOnly 쿠키에 설정
            ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                    .maxAge(7 * 24 * 60 * 60)  // 7일
                    .path("/")
                    .secure(true)  // HTTPS 연결에서만 전송
                    .sameSite("None")  // 크로스 사이트 요청에서 쿠키를 사용할 수 있도록
                    .httpOnly(true)  // JS에서 접근할 수 없도록
                    .build();
            response.setHeader("Set-Cookie", cookie.toString());  // 응답 헤더에 쿠키 설정

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void validateEmail(String email) {
        if (!isValidEmailFormat(email)) {
            throw new InvalidEmailFormatException("잘못된 이메일 형식입니다.");
        }
    }

    private void checkDuplicateEmail(String email) {
        userRepository.findByEmail(email)
                .ifPresent(user -> {
                    throw new DuplicateEmailException("이메일이 이미 존재합니다.");
                });
    }

    private User createUser(RegisterRequest request) {
        return User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .role(Role.USER)
                .build();
    }

    private Map<String, String> createResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return response;
    }

    private void authenticateUser(String email, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    private boolean isValidEmailFormat(String email) {
        // 이메일 형식 검사를 위한 정규식
        String emailRegex = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";
        return Pattern.compile(emailRegex).matcher(email).matches();
    }
}
