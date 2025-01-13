package com.example.loginDemo.service;

import com.example.loginDemo.auth.JwtService;
import com.example.loginDemo.domain.*;
import com.example.loginDemo.dto.ChatMessageDTO;
import com.example.loginDemo.dto.RecipeResponse;
import com.example.loginDemo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatService {
    private static final String LLM_GENERAL_URL = "http://llm-container:5002/ask/general";
    private static final String LLM_RECIPE_URL = "http://llm-container:5002/ask/recipe";

    private final RestTemplate restTemplate;

    public RecipeResponse askRecipeQuestion(Map<String, Object> payload, String token) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("detectedIngredients", payload.get("detectedIngredients"));
        requestBody.put("selectedStoredIngredients", payload.get("selectedStoredIngredients"));
        requestBody.put("userPreferences", payload.get("userPreferences"));
        requestBody.put("additionalRequest", payload.get("additionalRequest"));

        ResponseEntity<Map> response = sendRequestToFlask(LLM_RECIPE_URL, requestBody, token);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            Map<String, Object> responseBody = (Map<String, Object>) response.getBody().get("response");
            if (responseBody != null && responseBody.containsKey("contents") && responseBody.containsKey("imageLink")) {
                return new RecipeResponse((String) responseBody.get("contents"), (String) responseBody.get("imageLink"));
            } else {
                throw new RuntimeException("'response' 필드에서 'contents' 또는 'imageLink' 값을 찾을 수 없습니다.");
            }
        } else {
            throw new RuntimeException("Flask 서버에서 유효하지 않은 응답을 받았습니다.");
        }
    }

    public Map<String, Object> askGeneralQuestion(Map<String, String> payload, String token) {
        String question = payload.get("question");
        String searchResults = payload.getOrDefault("search_results", "");

        if (question == null || question.trim().isEmpty()) {
            throw new IllegalArgumentException("질문이 제공되지 않았습니다.");
        }

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("question", question);
        requestBody.put("search_results", searchResults);

        ResponseEntity<Map> response = sendRequestToFlask(LLM_GENERAL_URL, requestBody, token);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return response.getBody();
        } else {
            throw new RuntimeException("Flask 서버로부터 유효하지 않은 응답이 반환되었습니다.");
        }
    }

    public List<ChatMessageDTO> getMessageHistory(String token) {
        // 메시지 조회 로직 구현
        // 예: 데이터베이스에서 메시지 검색
        return List.of(); // 여기에 실제 구현 추가
    }

    private ResponseEntity<Map> sendRequestToFlask(String url, Map<String, Object> requestBody, String accessToken) {
        HttpHeaders headers = createHeaders(accessToken);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            return restTemplate.exchange(url, HttpMethod.POST, request, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Flask 서버와의 통신 중 오류 발생: " + e.getMessage());
        }
    }

    private HttpHeaders createHeaders(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", accessToken);
        return headers;
    }
}

