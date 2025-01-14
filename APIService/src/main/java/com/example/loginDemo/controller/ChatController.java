package com.example.loginDemo.controller;

import com.example.loginDemo.dto.ChatMessageDTO;
import com.example.loginDemo.dto.RecipeResponse;
import com.example.loginDemo.domain.*;
import com.example.loginDemo.service.ChatService;
import com.example.loginDemo.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatBotService;
    private final MessageService messageService;

    @PostMapping("/recipes/questions")
    public ResponseEntity<?> askForRecipes(@RequestBody Map<String, Object> payload,
                                           @RequestHeader("Authorization") String accessToken) {
        String token = extractToken(accessToken);
        try {
            RecipeResponse recipeResponse = chatBotService.askForRecipes(payload, token);
            return ResponseEntity.ok(Map.of("response", recipeResponse));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Flask 서버 통신 중 오류 발생: " + e.getMessage()));
        }
    }

    @PostMapping("/general/questions")
    public ResponseEntity<?> askToGPT(@RequestBody Map<String, String> payload,
                                      @RequestHeader("Authorization") String accessToken) {
        String token = extractToken(accessToken);
        try {
            Map<String, Object> response = chatBotService.askToGPT(payload, token);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Flask 서버 통신 중 오류 발생: " + e.getMessage()));
        }
    }

    @GetMapping("/messages")
    public ResponseEntity<List<ChatMessageDTO>> getMessageHistory(@RequestHeader("Authorization") String accessToken) {
        String token = extractToken(accessToken);
        List<ChatMessageDTO> chatMessageDTOs = chatBotService.getMessageHistory(token);
        return ResponseEntity.ok(chatMessageDTOs);
    }

    @DeleteMapping("/messages")
    public ResponseEntity<Void> deleteAllMessages(@RequestHeader("Authorization") String accessToken) {
        String token = extractToken(accessToken);
        chatBotService.deleteAllMessages(token);
        return ResponseEntity.noContent().build();
    }

    private String extractToken(String accessToken) {
        return accessToken.replace("Bearer ", "");
    }
}
