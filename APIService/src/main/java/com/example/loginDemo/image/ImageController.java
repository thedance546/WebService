package com.example.loginDemo.image;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/image")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;  // ImageService 주입

    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> uploadImage(@RequestParam("image") MultipartFile image) throws IOException {
        try {
            // 1. Spring에서 Flask API로 이미지 전송
            String flaskResponse = imageService.sendImageToYolo(image);

            // 2. Flask에서 받은 응답을 JSON으로 파싱
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> flaskResponseMap = objectMapper.readValue(flaskResponse, Map.class);

            Object detections = flaskResponseMap.get("detections");

            if (detections instanceof List) {
                // "detections"가 List 형식일 경우, name만 추출
                List<Map<String, Object>> detectionsList = (List<Map<String, Object>>) detections;
                Map<String, Integer> classCounts = new HashMap<>();

                for (Map<String, Object> detection : detectionsList) {
                    String className = (String) detection.get("name");
                    classCounts.put(className, classCounts.getOrDefault(className, 0) + 1);
                }

                // 3. 클라이언트에게 name 값만 응답으로 반환
                return ResponseEntity.ok(Map.of("detectedClasses", classCounts));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                        Map.of("error", "Invalid response format from Flask API")
                );
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("error", "Failed to communicate with YOLO Flask API", "message", e.getMessage())
            );
        }
    }
}
