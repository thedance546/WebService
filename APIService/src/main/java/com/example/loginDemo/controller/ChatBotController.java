package com.example.loginDemo.controller;

import com.example.loginDemo.service.ChatBotService;
import com.example.loginDemo.domain.*;
import com.example.loginDemo.exception.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatBotController {
    private static final String LLM_GENERAL_URL = "http://llm-container:5002/ask/general";
    private static final String LLM_RECIPE_URL = "http://llm-container:5002/ask/recipe";
    private final ChatBotService chatBotService;

    //LLM
    @PostMapping("/recipes/questions")
    public Map<String, Object> askToFlask(@RequestBody Map<String, Object> payload,
                                          @RequestHeader("Authorization") String accessToken) {

        // Flask 서버에 전달할 요청 본문 구성
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("detectedIngredients", payload.get("detectedIngredients"));
        requestBody.put("selectedStoredIngredients", payload.get("selectedStoredIngredients"));
        requestBody.put("userPreferences", payload.get("userPreferences"));
        requestBody.put("additionalRequest", payload.get("additionalRequest"));

        // HTTP 요청을 위한 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        // RestTemplate을 사용하여 Flask 서버에 요청 보내기
        RestTemplate restTemplate = new RestTemplate();
        try {
            // Flask 서버에 POST 요청 보내기
            ResponseEntity<Map> response = restTemplate.exchange(
                    LLM_RECIPE_URL, HttpMethod.POST, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                String botResponse = (String) response.getBody().get("response");
                return Map.of("response", botResponse);
            } else {
                return Map.of("error", "Flask 서버에서 유효하지 않은 응답을 받았습니다.");
            }

        } catch (Exception e) {
            return Map.of("error", "Flask 서버와의 통신 중 오류 발생: " + e.getMessage());
        }
    }

    //GPT
    @PostMapping("/general/questions")
    public ResponseEntity<?> askToGPT(@RequestBody Map<String, String> payload, @RequestHeader("Authorization") String accessToken) {
        // 질문 및 검색 결과를 검증
        String question = payload.get("question");
        String searchResults = payload.getOrDefault("search_results", "");

        if (question == null || question.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "질문이 제공되지 않았습니다."));
        }

        RestTemplate restTemplate = new RestTemplate();

        // Flask 서버로 보낼 요청 데이터
        Map<String, Object> flaskRequest = new HashMap<>();
        flaskRequest.put("question", question);
        flaskRequest.put("search_results", searchResults);

        // HTTP 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // HTTP 요청 생성
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(flaskRequest, headers);

        try {
            // Flask 서버에 POST 요청
            ResponseEntity<Map> response = restTemplate.exchange(
                    LLM_GENERAL_URL,
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            // Flask 서버 응답 처리
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return ResponseEntity.ok(response.getBody());
            } else {
                return ResponseEntity.status(response.getStatusCode())
                        .body(Map.of("error", "Flask 서버로부터 유효하지 않은 응답이 반환되었습니다."));
            }
        } catch (Exception e) {
            // 오류 처리
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Flask 서버와의 통신 중 오류 발생: " + e.getMessage()));
        }
    }

    //메세지 조회
    @GetMapping("/messages")
    public ResponseEntity<List<Message>> getMessageHistory(@RequestHeader("Authorization") String accessToken) {
        String token = extractToken(accessToken);
        List<Message> messages = chatBotService.getAllMessagesByUser(token);
        return ResponseEntity.ok(messages);
    }

    // 추출 메서드
    private String extractToken(String accessToken) {
        return accessToken.replace("Bearer ", "");
    }
}
