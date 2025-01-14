package com.example.loginDemo.service;

import com.example.loginDemo.dto.ChatMessageDTO;
import com.example.loginDemo.dto.RecipeResponse;
import com.example.loginDemo.domain.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatBotService {
    private final MessageService messageService;
    private final RestTemplate restTemplate;

    private static final String LLM_GENERAL_URL = "http://llm-container:5002/ask/general";
    private static final String LLM_RECIPE_URL = "http://llm-container:5002/ask/recipe";

    // 사용자가 입력한 재료 정보를 기반으로 레시피를 요청
    public RecipeResponse askForRecipes(Map<String, Object> payload, String token) {
        String recipeRequest = generateRecipeRequestString(payload);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("detectedIngredients", payload.get("detectedIngredients"));
        requestBody.put("selectedStoredIngredients", payload.get("selectedStoredIngredients"));
        requestBody.put("userPreferences", payload.get("userPreferences"));
        requestBody.put("additionalRequest", payload.get("additionalRequest"));

        ResponseEntity<Map> response;
        try {
            response = sendRequestToFlask(LLM_RECIPE_URL, requestBody, token);
        } catch (IllegalStateException e) {
            throw new IllegalStateException("Flask 서버와의 통신 중 오류가 발생했습니다: " + e.getMessage());
        }

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            Map<String, Object> responseBody = (Map<String, Object>) response.getBody().get("response");
            if (responseBody != null && responseBody.containsKey("contents") && responseBody.containsKey("imageLink")) {
                String contents = ((String) responseBody.get("contents")).replace("\n", " ");
                String imageLink = (String) responseBody.get("imageLink");

                RecipeResponse recipeResponse = new RecipeResponse(contents, imageLink);
                messageService.saveMessage(token, recipeRequest, contents);
                return recipeResponse;
            } else {
                throw new IllegalArgumentException("'response' 필드에서 'contents' 또는 'imageLink' 값을 찾을 수 없습니다.");
            }
        } else {
            throw new IllegalStateException("Flask 서버에서 유효하지 않은 응답을 받았습니다.");
        }
    }

    // 일반 챗봇에 질문
    public Map<String, Object> askToGPT(Map<String, String> payload, String token) {
        String question = payload.get("question");
        if (question == null || question.trim().isEmpty()) {
            throw new IllegalArgumentException("질문이 제공되지 않았습니다.");
        }

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("question", question);
        requestBody.put("search_results", payload.getOrDefault("search_results", ""));

        ResponseEntity<Map> response;
        try {
            response = sendRequestToFlask(LLM_GENERAL_URL, requestBody, token);
        } catch (IllegalStateException e) {
            throw new IllegalStateException("Flask 서버와의 통신 중 오류가 발생했습니다: " + e.getMessage());
        }

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            String responseContent = (String) response.getBody().get("response");
            messageService.saveMessage(token, question, responseContent);
            return response.getBody();
        } else {
            throw new IllegalStateException("Flask 서버로부터 유효하지 않은 응답이 반환되었습니다.");
        }
    }

    // 사용자별 메세지 기록 조회
    public List<ChatMessageDTO> getMessageHistory(String token) {
        List<Message> messages = messageService.getAllMessagesByUser(token);
        if (messages == null || messages.isEmpty()) {
            throw new IllegalStateException("해당 토큰에 대한 메세지 기록이 없습니다.");
        }

        return messages.stream()
                .map(message -> new ChatMessageDTO(
                        message.getId(),
                        message.getQuestion(),
                        message.getResponse()))
                .collect(Collectors.toList());
    }

    public void deleteAllMessages(String token) {
        messageService.deleteAllMessagesByUser(token);
    }

    // Helper methods
    // Flask 서버에 요청을 보내는 메서드
    private ResponseEntity<Map> sendRequestToFlask(String url, Map<String, Object> requestBody, String token) {
        HttpHeaders headers = createHeaders(token);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
        try {
            return restTemplate.exchange(url, HttpMethod.POST, request, Map.class);
        } catch (Exception e) {
            throw new IllegalStateException("Flask 서버와의 통신 중 오류 발생: " + e.getMessage());
        }
    }

    // HTTP 요청 헤더 생성
    private HttpHeaders createHeaders(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", token);
        return headers;
    }

    // 사용자의 요청 문자열을 생성
    private String generateRecipeRequestString(Map<String, Object> payload) {
        List<Map<String, Object>> detectedIngredients = (List<Map<String, Object>>) payload.get("detectedIngredients");
        if (detectedIngredients == null || detectedIngredients.isEmpty()) {
            return "유효한 재료 목록이 없습니다.";
        }

        return detectedIngredients.stream()
                .map(ingredient -> (String) ingredient.get("name"))
                .filter(Objects::nonNull)
                .collect(Collectors.joining(", ")) + "로 만들 수 있는 레시피 알려줘";
    }
}
