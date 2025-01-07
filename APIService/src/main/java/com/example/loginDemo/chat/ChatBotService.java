package com.example.loginDemo.chat;

import com.example.loginDemo.domain.*;
import com.example.loginDemo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatBotService {
    private final MessageRepository messageRepository;

    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    public List<Message> getMessagesByUser(User user) {
        return messageRepository.findByUser(user);
    }

    public void saveMessage(HttpEntity<Map<String, String>> request, ResponseEntity<Map> response, User user) {
        String question = (String) request.getBody().get("question");
        String botResponse = response.getBody().get("response").toString();

        Message message = new Message();
        message.setQuestion(question);
        message.setResponse(botResponse);
        message.setUser(user);

        messageRepository.save(message);
    }
}
