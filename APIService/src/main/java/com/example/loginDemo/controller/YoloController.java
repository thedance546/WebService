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

    @GetMapping("/items/ping")
    public ResponseEntity<String> pingBoundingServer() {
        boolean isServerReachable = yoloService.pingBoundingServer();

        if (isServerReachable) {
            return new ResponseEntity<>("Bounding server is reachable", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Bounding server is not reachable", HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

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
    public ResponseEntity<byte[]> getResultImage(@RequestParam("image") MultipartFile imageFile) {
        try {
            return yoloService.getResultImage(imageFile);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    //바운딩3
    @PostMapping("/items/detection3")
    public ResponseEntity<byte[]> b(@RequestParam("image") MultipartFile imageFile) {
        try {
            // 바운딩 박스 그린 결과 이미지 가져오기
            byte[] resultImage = yoloService.b(imageFile);

            // 이미지 결과를 byte[] 형태로 반환
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG) // 결과가 JPEG 이미지라고 가정
                    .body(resultImage);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);  // 오류 처리
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