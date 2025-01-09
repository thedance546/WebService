package com.example.loginDemo.chat;

import com.example.loginDemo.domain.*;
import com.example.loginDemo.exception.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ChatBotController {

//    private static final String LLM_URL = "http://llm-container:5002/ask";
//    private static final String LLM_URL = "http://llm_all:5002/ask";
    private static final String LLM_URL = "http://llm_run:5002/ask";
    private static final String gpt_URL = "http://gpt-container:5003/ask";
    private final ChatBotService chatBotService;

    //LLM
    @PostMapping("/recipes/messages")
    public Map<String, String> askToLLM(@RequestBody Map<String, String> payload,
                                           @AuthenticationPrincipal User user) {

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

                chatBotService.saveMessage(request, response, user);

                return Map.of("response", botResponse);
            } else {
                throw new FlaskCommunicationException("Flask 서버로부터 유효하지 않은 응답이 반환되었습니다.");
            }
        } catch (Exception e) {
            throw new FlaskCommunicationException("Flask 서버와의 통신 중 오류 발생: " + e.getMessage());
        }
    }

    @GetMapping("/general/messages")
    public ResponseEntity<List<Message>> getMessageHistory(@AuthenticationPrincipal User user,
                                                           @RequestParam(required = false) String filter) {
        List<Message> messages;

        if ("user".equalsIgnoreCase(filter)) {
            messages = chatBotService.getMessagesByUser(user);
        } else {
            messages = chatBotService.getAllMessages();
        }

        return ResponseEntity.ok(messages);
    }

    //GPT
    @PostMapping("/gpt")
    public Map<String, String> askToGPT(@RequestBody Map<String, String> payload,
                                        @AuthenticationPrincipal User user) {
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
            ResponseEntity<Map> response = restTemplate.postForEntity(gpt_URL, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                String botResponse = response.getBody().get("response").toString();

                chatBotService.saveMessage(request, response, user);

                return Map.of("response", botResponse);
            } else {
                throw new FlaskCommunicationException("GPT 서버로부터 유효하지 않은 응답이 반환되었습니다.");
            }
        } catch (Exception e) {
            throw new FlaskCommunicationException("GPT 서버와의 통신 중 오류 발생: " + e.getMessage());
        }
    }


}
