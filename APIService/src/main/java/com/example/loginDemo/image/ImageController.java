package com.example.loginDemo.image;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
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
    private final RestTemplate restTemplate = new RestTemplate();
    private String yoloApiUrl = "http://localhost:5000/detect";  // YOLO Flask API URL

    private final ImageService imageService;  // ImageService 주입

    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> detectObjects(@RequestParam("image") MultipartFile imageFile) {
        try {
            // Send image to YOLO API and get detection result
            Map<String, Object> detectionResult = imageService.sendImageToYolo(imageFile);

            // Return detection result as response
            return ResponseEntity.ok(detectionResult);
        } catch (Exception e) {
            // Handle any errors (e.g., API failure, internal errors)
            return ResponseEntity.status(500).body(Map.of("error", "Failed to process image", "message", e.getMessage()));
        }
    }
}
