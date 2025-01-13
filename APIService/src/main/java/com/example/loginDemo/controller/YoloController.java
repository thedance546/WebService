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
            DetectionResponse response = yoloService.detectAndReturn(imageFile);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    //바운딩2
    @PostMapping("/items/detection2")
    public ResponseEntity<byte[]> sendBoundingImage(@RequestParam("image") MultipartFile imageFile) {
        try {
            // 이미지를 보내고 바운딩 박스를 그린 결과 이미지 받기
            byte[] resultImage = yoloService.sendBoundingImage(imageFile);

            // Content-Type을 image/jpeg로 설정하여 반환
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.IMAGE_JPEG);

            return new ResponseEntity<>(resultImage, headers, HttpStatus.OK);

        } catch (IOException e) {
            // 예외 처리: 실패 시 500 에러 반환
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // receipt
    @PostMapping("/receipts")
    public ResponseEntity<ReceiptResponse> processImage(@RequestParam("image") MultipartFile imageFile) {
        try {
            ReceiptResponse receiptResponse = yoloService.processReceiptImage(imageFile);
            return ResponseEntity.ok(receiptResponse);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(new ReceiptResponse(null, List.of("Failed to process image")));
        }
    }
}