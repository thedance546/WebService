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

    private final String FLASK_API_URL = "http://localhost:5000/ask";
    private final RestTemplate restTemplate;
    // Flask API에 질의하는 비즈니스 로직
    public ChatResponse askFlask(String question, String searchResults) {
        // question이 비어있는지 확인
        if (question == null || question.trim().isEmpty()) {
            return new ChatResponse("The 'question' field is required and cannot be empty.");
        }

        // Flask API로 보낼 데이터를 준비
        Map<String, String> flaskRequest = new HashMap<>();
        flaskRequest.put("question", question);
        flaskRequest.put("search_results", searchResults);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        HttpEntity<Map<String, String>> request = new HttpEntity<>(flaskRequest, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    FLASK_API_URL, HttpMethod.POST, request, Map.class);

            // Flask API 응답에서 생성된 답변을 추출
            Map<String, String> responseBody = response.getBody();
            String answer = responseBody != null ? responseBody.get("answer") : "No answer found.";

            // 응답 데이터 반환
            return new ChatResponse(answer);

        } catch (Exception e) {
            return new ChatResponse("Failed to communicate with Flask API: " + e.getMessage());
        }
    }
}
