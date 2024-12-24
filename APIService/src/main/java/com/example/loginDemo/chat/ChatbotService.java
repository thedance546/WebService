package com.example.loginDemo.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final String flaskUrl = "http://localhost:5000/ask";
    private final RestTemplate restTemplate;

    public String askChatGpt(ChatRequest request) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");

            HttpEntity<ChatRequest> entity = new HttpEntity<>(request, headers);

            // Flask 서버에 POST 요청
            ResponseEntity<String> response = restTemplate.postForEntity(flaskUrl, entity, String.class);

            return response.getBody(); // Flask 서버에서 반환된 응답
        } catch (Exception e) {
            e.printStackTrace();
            return "Error communicating with Flask server: " + e.getMessage();
        }
    }
}
