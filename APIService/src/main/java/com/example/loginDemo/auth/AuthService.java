package com.example.loginDemo.auth;

import com.example.loginDemo.domain.Role;
import com.example.loginDemo.domain.User;
import com.example.loginDemo.dto.AuthenticationRequest;
import com.example.loginDemo.dto.AuthenticationResponse;
import com.example.loginDemo.dto.RegisterRequest;
import com.example.loginDemo.exception.DuplicateEmailException;
import com.example.loginDemo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

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
        // 이메일 중복 체크
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            throw new DuplicateEmailException("이메일이 이미 존재합니다.");
        }

        var user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .role(Role.USER)
                .build();
        userRepository.save(user);

        // 응답 메시지 생성
        Map<String, String> response = new HashMap<>();
        response.put("message", "회원가입이 완료되었습니다.");

        return response;
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        //token 생성
        var accessToken = jwtService.generateAccessToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Transactional
    public Map<String, String> deleteAccount(String accessToken) {
        // Access token 검증 및 사용자 확인
        String email = jwtService.extractUsername(accessToken);
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 사용자 정보 삭제
        userRepository.delete(user);

        // Access token 만료 시간 추출
        long expirationTime = jwtService.extractExpiration(accessToken).getTime();

        // 토큰을 블랙리스트에 추가
        blacklistService.addToBlacklist(accessToken, expirationTime);

        // 응답 메시지 생성
        Map<String, String> response = new HashMap<>();
        response.put("message", "Successfully deleted the account");

        return response;
    }


}
