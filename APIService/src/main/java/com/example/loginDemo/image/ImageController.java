package com.example.loginDemo.image;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequiredArgsConstructor
public class ImageController {

    private final YoloService yoloService;

    @PostMapping("/send-image")
    public ResponseEntity<String> sendImage(@RequestParam("image") MultipartFile image) {
        try {
            String result = yoloService.sendImageToYolo(image);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error sending image to YOLO API");
        }
    }
}
