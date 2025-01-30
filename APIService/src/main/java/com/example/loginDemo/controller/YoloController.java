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
@CrossOrigin(origins = "http://localhost:8080")
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