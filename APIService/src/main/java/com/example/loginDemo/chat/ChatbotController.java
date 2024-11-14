package com.example.loginDemo.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

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

    // 레시피 질의
    @PostMapping("/ask")
    public ResponseEntity<ChatResponse> askFlask(@RequestBody ChatRequest requestBody) {
        // Flask API로 보낼 데이터를 준비
        String question = requestBody.getQuestion();
        String searchResults = requestBody.getSearchResults();

        // 서비스 호출
        ChatResponse response = chatbotService.askFlask(question, searchResults);

        // 응답 데이터 반환
        return ResponseEntity.ok(response);
    }
}
