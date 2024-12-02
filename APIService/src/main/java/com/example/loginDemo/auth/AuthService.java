package com.example.loginDemo.auth;

import com.example.loginDemo.domain.Role;
import com.example.loginDemo.domain.User;
import com.example.loginDemo.dto.AuthenticationRequest;
import com.example.loginDemo.dto.AuthenticationResponse;
import com.example.loginDemo.dto.RegisterRequest;
import com.example.loginDemo.exception.DuplicateEmailException;
import com.example.loginDemo.exception.InvalidEmailFormatException;
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

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticateUser(request.getEmail(), request.getPassword());
        User user = findUserByEmail(request.getEmail());

        String accessToken = jwtService.generateAccessToken(user, user.getRole().name());
        String refreshToken = jwtService.generateRefreshToken(user, user.getRole().name());

        return new AuthenticationResponse(accessToken, refreshToken);
    }

    @Transactional
    public Map<String, String> deleteAccount(String accessToken) {
        String email = jwtService.extractUsername(accessToken);
        User user = findUserByEmail(email);

        userRepository.delete(user);

        blacklistService.addToBlacklist(accessToken, jwtService.extractExpiration(accessToken).getTime(), "account_deleted");

        return createResponse("Successfully deleted the account");
    }

    //Helper Methods
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
