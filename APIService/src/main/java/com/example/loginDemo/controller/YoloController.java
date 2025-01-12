package com.example.loginDemo.controller;

import com.example.loginDemo.dto.DetectionResponse;
import com.example.loginDemo.dto.ReceiptResponse;
import com.example.loginDemo.service.YoloService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;


import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class YoloController {
    private final YoloService yoloService;

    //ingredient
    @PostMapping("/items/detection")
    public ResponseEntity<DetectionResponse> detectAndReturn(@RequestParam("image") MultipartFile imageFile) {
        try {
            // 객체 감지 결과 가져오기
            Map<String, String> detectionResults = yoloService.detectObjects(imageFile);

            // 바운딩 박스를 그린 결과 이미지 가져오기
            byte[] resultImage = yoloService.returnImage(imageFile);

            // Base64로 인코딩
            String base64Image = Base64.getEncoder().encodeToString(resultImage);
            String imageDataUri = "data:image/jpeg;base64," + base64Image;

            // DTO 생성
            DetectionResponse response = new DetectionResponse(detectionResults, imageDataUri);

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // receipt
    @PostMapping("/receipts")
    public ResponseEntity<ReceiptResponse> processImage(@RequestParam("image") MultipartFile imageFile) {
        try {
            // 이미지를 처리하고 ReceiptResponse 객체를 받음
            ReceiptResponse receiptResponse = yoloService.processReceiptImage(imageFile);

            // 처리된 결과를 ReceiptResponse로 반환
            return ResponseEntity.ok(receiptResponse);
        } catch (IOException e) {
            // 오류 발생 시, 오류 메시지를 포함한 ReceiptResponse 반환
            return ResponseEntity.status(500).body(new ReceiptResponse(null, List.of("Failed to process image")));
        }
    }
}