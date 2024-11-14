package com.example.loginDemo.chat;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ask")
public class AskQuestionController {
    // Flask 서버 URL
    @Value("${flask.api.url}")
    private String flaskApiUrl;

    private final RestTemplate restTemplate;

    public AskQuestionController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping
    public Map<String, String> askQuestion(@RequestBody Map<String, String> request) {
        // 질문 추출
        String question = request.get("question");

        // Flask API로 질문 보내기
        String flaskUrl = UriComponentsBuilder.fromHttpUrl(flaskApiUrl)
                .path("/ask")
                .toUriString();

        // Flask API에 전송할 데이터 설정
        Map<String, String> requestData = new HashMap<>();
        requestData.put("question", question);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestData);

        // Flask 서버에서 응답 받기
        ResponseEntity<Map> response = restTemplate.exchange(
                flaskUrl,
                HttpMethod.POST,
                entity,
                Map.class
        );

        // Flask API에서 받은 응답
        Map<String, String> responseBody = response.getBody();

        if (responseBody != null && responseBody.containsKey("response")) {
            // Flask API 응답 반환
            return Map.of("response", responseBody.get("response"));
        } else {
            return Map.of("error", "No response from Flask API");
        }
    }
}
