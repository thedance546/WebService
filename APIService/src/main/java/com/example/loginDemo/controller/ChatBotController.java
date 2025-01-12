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
    private static final String LLM_URL = "http://llm_run:5002/ask";
    private static final String gpt_URL = "http://gpt-container:5003/ask";
    private final ChatBotService chatBotService;

    //LLM
    @PostMapping("/recipes/questions")
    public Map<String, String> askToLLM(@RequestBody Map<String, String> payload,
                                        @RequestHeader("Authorization") String accessToken) {

        String token = extractToken(accessToken);

        String question = payload.get("question");
        if (question == null || question.trim().isEmpty()) {
            return Map.of("error", "질문이 제공되지 않았습니다.");
        }

        RestTemplate restTemplate = new RestTemplate();

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("question", question);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(LLM_URL, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                String botResponse = response.getBody().get("response").toString();

                chatBotService.saveMessage(request, response, token);

                return Map.of("response", botResponse);
            } else {
                throw new FlaskCommunicationException("Flask 서버로부터 유효하지 않은 응답이 반환되었습니다.");
            }
        } catch (Exception e) {
            throw new FlaskCommunicationException("Flask 서버와의 통신 중 오류 발생: " + e.getMessage());
        }
    }

    @PostMapping("/recipes/questions/json")

    //메세지 조회
    @GetMapping("/messages")
    public ResponseEntity<List<Message>> getMessageHistory(@RequestHeader("Authorization") String accessToken) {
        String token = extractToken(accessToken);
        List<Message> messages = chatBotService.getAllMessagesByUser(token);
        return ResponseEntity.ok(messages);
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
                    gpt_URL,
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

    // 추출 메서드
    private String extractToken(String accessToken) {
        return accessToken.replace("Bearer ", "");
    }
}
