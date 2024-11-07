package com.example.loginDemo.auth;

import com.example.loginDemo.domain.Role;
import com.example.loginDemo.domain.User;
import com.example.loginDemo.dto.AuthenticationRequest;
import com.example.loginDemo.dto.AuthenticationResponse;
import com.example.loginDemo.dto.RegisterRequest;
import com.example.loginDemo.exception.DuplicateEmailException;
import com.example.loginDemo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public ResponseEntity<Object> register(RegisterRequest request) {
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
        System.out.println("Saving user: " + user); // 로그 추가
        userRepository.save(user);

        // OK 상태 코드와 메시지 반환
        Map<String, String> response = new HashMap<>();
        response.put("message", "회원가입이 완료되었습니다.");

        return new ResponseEntity<>(response, HttpStatus.OK);
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
        var jwtToken = jwtService.generateAccessToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}
