package com.example.loginDemo.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ChatbotController {

    private static final String FLASK_SERVER_URL = "http://localhost:5002/ask";

    @PostMapping("/ask")
    public Map<String, String> askQuestion(@RequestBody Map<String, String> payload) {
        String question = payload.get("question");
        if (question == null || question.trim().isEmpty()) {
            return Map.of("error", "질문이 제공되지 않았습니다.");
        }

        RestTemplate restTemplate = new RestTemplate();

        // 요청 데이터 생성
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("question", question);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

        try {
            // Flask 서버로 요청 전송
            ResponseEntity<Map> response = restTemplate.postForEntity(FLASK_SERVER_URL, request, Map.class);

            // 응답 처리
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return Map.of("response", response.getBody().get("response").toString());
            } else {
                return Map.of("error", "Flask 서버로부터 유효하지 않은 응답이 반환되었습니다.");
            }
        } catch (Exception e) {
            return Map.of("error", "Flask 서버와의 통신 중 오류 발생: " + e.getMessage());
        }
    }
}
