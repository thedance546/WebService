package com.example.loginDemo.service;

import com.example.loginDemo.auth.JwtService;
import com.example.loginDemo.domain.Message;
import com.example.loginDemo.domain.User;
import com.example.loginDemo.repository.MessageRepository;
import com.example.loginDemo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    // 유저별 메시지 조회
    public List<Message> getAllMessagesByUser(String accessToken) {
        User user = getCurrentUser(accessToken);
        return messageRepository.findByUser(user);
    }

    // 유저별 메시지 삭제
    @Transactional
    public void deleteAllMessagesByUser(String accessToken) {
        User user = getCurrentUser(accessToken);
        messageRepository.deleteByUser(user);
    }

    // 메시지 저장
    public void saveMessage(String accessToken,String question, String response) {
        User user = getCurrentUser(accessToken);

        Message message = new Message();
        message.setQuestion(question);
        message.setResponse(response);
        message.setUser(user);

        messageRepository.save(message);
    }


    // 현재 로그인한 유저 정보 추출
    private User getCurrentUser(String accessToken) {
        String email = jwtService.extractUsername(accessToken);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
