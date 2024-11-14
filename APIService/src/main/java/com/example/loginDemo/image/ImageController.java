package com.example.loginDemo.image;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api/image")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;  // ImageService 주입

    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> uploadImage(@RequestParam("image") MultipartFile image) throws IOException {
        try {
            // 1. Spring에서 Flask API로 이미지 전송 (ImageService 사용)
            String flaskResponse = imageService.sendImageToYolo(image);  // Multipart로 이미지 전송

            // 2. Flask에서 받은 응답을 그대로 클라이언트에 반환
            return ResponseEntity.ok(Map.of("response", flaskResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("error", "Failed to communicate with YOLO Flask API", "message", e.getMessage())
            );
        }
    }
}
