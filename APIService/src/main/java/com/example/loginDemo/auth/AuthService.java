package com.example.loginDemo.auth;

import com.example.loginDemo.domain.Role;
import com.example.loginDemo.domain.User;
import com.example.loginDemo.dto.AuthenticationRequest;
import com.example.loginDemo.dto.AuthenticationResponse;
import com.example.loginDemo.dto.RegisterRequest;
import com.example.loginDemo.exception.DuplicateEmailException;
import com.example.loginDemo.exception.InvalidEmailFormatException;
import com.example.loginDemo.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
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

        // Access Token과 Refresh Token 생성
        String accessToken = jwtService.generateAccessToken(user, user.getRole().name());
        String refreshToken = jwtService.generateRefreshToken(user, user.getRole().name());

        // 로그인 후 처리 (Access Token과 Refresh Token을 JSON 응답 본문에 포함)
        handleLogin(response, accessToken, refreshToken);
    }

    // 로그인 후 처리 (Access Token과 Refresh Token을 JSON 응답 본문에 포함)
    private void handleLogin(HttpServletResponse response, String accessToken, String refreshToken) {
        // Access Token과 Refresh Token을 JSON 응답 본문에 반환
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);

        response.setContentType("application/json");

        try {
            // Access Token을 JSON 응답 본문에 포함시켜 반환
            response.getWriter().write(new ObjectMapper().writeValueAsString(tokens));

            // Refresh Token을 HTTPOnly 쿠키에 설정
            ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                    .maxAge(7 * 24 * 60 * 60)  // 7일 동안 유효
                    .path("/")  // 전체 도메인에서 접근 가능
                    .secure(true)  // HTTPS 연결에서만 전송
                    .sameSite("None")  // 크로스 사이트 쿠키 설정
                    .httpOnly(true)  // JavaScript에서 접근할 수 없도록 설정
                    .build();
            response.setHeader("Set-Cookie", cookie.toString());  // 응답 헤더에 쿠키 설정

        } catch (IOException e) {
            e.printStackTrace();
        }
    }



    @Transactional
    public Map<String, String> deleteAccount(String accessToken) {
        String email = jwtService.extractUsername(accessToken);
        User user = findUserByEmail(email);

        //db 회원 데이터 삭제
        userRepository.delete(user);
        //토큰을 블랙리스트에 추가
        blacklistService.addToBlacklist(accessToken, jwtService.extractExpiration(accessToken).getTime(), "account_deleted");

        return createResponse("Successfully deleted the account");
    }

    //Methods
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
