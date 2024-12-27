package com.example.loginDemo.yolo;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/image")
@RequiredArgsConstructor
public class YoloController {
    private final YoloService yoloService;

    @PostMapping("/detect")
    public ResponseEntity<Map<String, String>> detectObjects(@RequestParam("image") MultipartFile imageFile) {
        try {
            Map<String, String> detectionResults = yoloService.detectObjects(imageFile);
            return ResponseEntity.ok(detectionResults);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null); // 내부 서버 오류
        }
    }

    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> processImage(@RequestParam("image") MultipartFile imageFile) {
        try {
            Map<String, Object> response = yoloService.processImage(imageFile);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to process image"));
        }
    }
}