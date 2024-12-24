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
    private final ChatbotService chatbotService;
    private final RestTemplate restTemplate;

    @PostMapping("/ask")
    public ResponseEntity<?> askChatGpt(@RequestBody ChatRequest chatRequest) {
        String response = chatbotService.askChatGpt(chatRequest);
        return ResponseEntity.ok(response);
    }
}
