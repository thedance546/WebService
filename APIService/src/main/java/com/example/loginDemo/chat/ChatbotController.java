package com.example.loginDemo.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ChatbotController {
    private final ChatbotService chatbotService;
    private final RestTemplate restTemplate;

    @PostMapping("/ask")
    public ResponseEntity<?> ask(@RequestBody Map<String, String> request) {
        String question = request.get("question");
        String searchResults = request.getOrDefault("search_results", "");

        if (question == null || question.isEmpty()) {
            return ResponseEntity.badRequest().body("Missing 'question' parameter");
        }

        String answer = chatbotService.askFlaskApi(question, searchResults);

        return ResponseEntity.ok().body(answer);
    }
}
