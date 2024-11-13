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

    private final RestTemplate restTemplate;

    // Flask 서버로 사용자 메시지를 보내고 응답 받기
    public String getChatbotResponse(String userMessage) {
        String flaskUrl = "http://localhost:5000/chatbot";  // Flask 서버 URL

        // HTTP 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 요청 본문 설정 (사용자 메시지)
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("message", userMessage);

        // HttpEntity 에 본문과 헤더 추가
        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);

        // Flask 서버로 POST 요청 보내기
        ResponseEntity<String> response = restTemplate.exchange(
                flaskUrl, HttpMethod.POST, requestEntity, String.class
        );

        // 응답 본문 반환
        return response.getBody();
    }
}
