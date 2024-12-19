package com.example.loginDemo.auth;

import com.example.loginDemo.domain.Role;
import com.example.loginDemo.domain.User;
import com.example.loginDemo.dto.AuthenticationRequest;
import com.example.loginDemo.dto.AuthenticationResponse;
import com.example.loginDemo.dto.RegisterRequest;
import com.example.loginDemo.exception.InvalidEmailFormatException;
import com.example.loginDemo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {
    @InjectMocks
    private AuthService authService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private BlacklistService blacklistService;

    @Mock
    private AuthenticationManager authenticationManager;

    private User user;
    private RegisterRequest registerRequest;
    private AuthenticationRequest authenticationRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Setup mock user using the builder (id is auto-generated)
        user = User.builder()
                .username("testUser")
                .email("test@domain.com")
                .password("1234")
                .role(Role.USER)
                .build();

        // Setup register request
        registerRequest = new RegisterRequest("testUser", "1234", "test@domain.com");

        // Setup authentication request
        authenticationRequest = new AuthenticationRequest("test@domain.com", "1234");
    }

    //회원가입
    @Test
    void register_success() {
        // Arrange
        when(userRepository.findByEmail(registerRequest.getEmail())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act
        Map<String, String> response = authService.register(registerRequest);

        // Assert
        assertEquals("회원가입이 완료되었습니다.", response.get("message"));
        verify(userRepository).save(any(User.class));
    }

    //이메일 형식이 잘못된 경우 예외가 발생하는지
    @Test
    void register_invalidEmail() {
        // Arrange
        RegisterRequest invalidEmailRequest = new RegisterRequest("testUser", "1234", "password");

        // Act & Assert
        assertThrows(InvalidEmailFormatException.class, () -> {
            authService.register(invalidEmailRequest);
        });
    }

    //로그인 테스트 (로그인 성공, 로그인 실패)
    @Test
    void authenticate_success() {
        // Arrange
        when(userRepository.findByEmail(authenticationRequest.getEmail())).thenReturn(Optional.of(user));
        when(jwtService.generateAccessToken(user, user.getRole().name())).thenReturn("accessToken");
        when(jwtService.generateRefreshToken(user, user.getRole().name())).thenReturn("refreshToken");

        // Act
        AuthenticationResponse response = authService.authenticate(authenticationRequest);

        // Assert
        assertNotNull(response.getAccessToken());
        assertNotNull(response.getRefreshToken());
        verify(userRepository).findByEmail(authenticationRequest.getEmail());
    }

    @Test
    void authenticate_userNotFound() {
        // Arrange
        when(userRepository.findByEmail(authenticationRequest.getEmail())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () -> {
            authService.authenticate(authenticationRequest);
        });
    }


}
