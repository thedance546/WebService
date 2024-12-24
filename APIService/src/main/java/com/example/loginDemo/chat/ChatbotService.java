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

    private final String FLASK_API_URL = "http://gpt_container:5000/ask";
    private final RestTemplate restTemplate;

    public String askFlaskApi(String question, String searchResults) {
        // 요청 데이터 설정
        Map<String, String> requestData = new HashMap<>();
        requestData.put("question", question);
        requestData.put("search_results", searchResults);

        // POST 요청 보내기
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestData, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    FLASK_API_URL,
                    HttpMethod.POST,
                    requestEntity,
                    Map.class
            );

            // Flask API에서 반환한 답변을 추출
            if (response.getStatusCode() == HttpStatus.OK) {
                Map responseBody = response.getBody();
                return (String) responseBody.get("answer");
            } else {
                return "Error: " + response.getStatusCode();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }
}
