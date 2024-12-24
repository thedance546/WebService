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

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("image") MultipartFile image) {
        if (image.isEmpty()) {
            return ResponseEntity.badRequest().body("Image file is required");
        }
        // 이미지 파일을 처리 로직 (추후)

        return ResponseEntity.ok("okokok");
    }

    @PostMapping("/ask")
    public ResponseEntity<?> ask(@RequestBody Map<String, String> request) {
        String question = request.get("question");
        String searchResults = request.getOrDefault("search_results", "");

        if (question == null || question.isEmpty()) {
            return ResponseEntity.badRequest().body("Missing 'question' parameter");
        }

        // Flask API에 질문을 보내고 답변을 받음
        String answer = chatbotService.askFlaskApi(question, searchResults);

        return ResponseEntity.ok().body(answer);
    }
}
