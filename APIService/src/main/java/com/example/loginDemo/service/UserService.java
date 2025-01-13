package com.example.loginDemo.service;

import com.example.loginDemo.domain.User;
import com.example.loginDemo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUserById(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("회원 ID가 존재하지 않습니다: " + userId);
        }
        userRepository.deleteById(userId);
    }
}
