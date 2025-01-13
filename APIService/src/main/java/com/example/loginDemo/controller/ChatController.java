package com.example.loginDemo.controller;

import com.example.loginDemo.dto.ChatMessageDTO;
import com.example.loginDemo.dto.RecipeResponse;
import com.example.loginDemo.domain.*;
import com.example.loginDemo.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatBotService;

    // LLM (레시피 관련 요청)
    @PostMapping("/recipes/questions")
    public ResponseEntity<?> askToFlaskForRecipes(@RequestBody Map<String, Object> payload,
                                                  @RequestHeader("Authorization") String accessToken) {
        String token = extractToken(accessToken);
        try {
            RecipeResponse recipeResponse = chatBotService.askRecipeQuestion(payload, token);
            return ResponseEntity.ok(Map.of("response", recipeResponse));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GPT (일반 질문 관련 요청)
    @PostMapping("/general/questions")
    public ResponseEntity<?> askToGPT(@RequestBody Map<String, String> payload,
                                      @RequestHeader("Authorization") String accessToken) {
        String token = extractToken(accessToken);
        try {
            Map<String, Object> response = chatBotService.askGeneralQuestion(payload, token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 메시지 조회
    @GetMapping("/messages")
    public ResponseEntity<List<ChatMessageDTO>> getMessageHistory(@RequestHeader("Authorization") String accessToken) {
        String token = extractToken(accessToken);
        List<ChatMessageDTO> chatMessageDTOs = chatBotService.getMessageHistory(token);
        return ResponseEntity.ok(chatMessageDTOs);
    }

    // 토큰 추출 메서드
    private String extractToken(String accessToken) {
        return accessToken.replace("Bearer ", "");
    }
}

