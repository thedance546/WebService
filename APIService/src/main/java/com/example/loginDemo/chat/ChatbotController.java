package com.example.loginDemo.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ChatbotController {
    private final ChatbotService chatbotService;

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest chatRequest) {
        String userMessage = chatRequest.getMessage();

        // Flask 서버에 사용자 메시지 전달 후 응답 받기
        String botResponse = chatbotService.getChatbotResponse(userMessage);

        // ChatResponse 객체 생성 후 반환
        return new ChatResponse(botResponse);
    }
}
