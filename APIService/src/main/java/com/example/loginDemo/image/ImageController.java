package com.example.loginDemo.image;

import com.example.loginDemo.dto.ObjectDetectionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/image")
@RequiredArgsConstructor
public class ImageController {
    private final ImageService imageService;
    private final RestTemplate restTemplate = new RestTemplate();

//    private final String yoloApiUrl = "http://localhost:5000/v1/object-detection/image_team6/{modelName}";
    private final String yoloApiUrl = "http://yolo-container:5000/object-detection/object_detection";

//    private final String FLASK_URL = "http://localhost:5001/object-detection/ocr_detection";
    private final String FLASK_URL = "http://receipt-container:5001/object-detection/ocr_detection";

    //yolo
    @PostMapping("/detect")
    public ResponseEntity<?> detectObjects(@RequestParam("image") MultipartFile imageFile) {
        try {
            // 이미지 파일을 Flask 서버에 전송
            RestTemplate restTemplate = new RestTemplate();

            // HTTP 요청을 위한 Headers 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            // MultipartBody에 이미지 추가
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("image", new MultipartInputStreamFileResource(imageFile));  // MultipartInputStreamFileResource 사용

            // HttpEntity 설정 (헤더와 바디 포함)
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // Flask 서버로 POST 요청 보내기
            ResponseEntity<String> response = restTemplate.exchange(
                    yoloApiUrl,  // Flask 서버 URL
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            // Flask 서버에서 반환된 JSON 응답 처리
            return ResponseEntity.ok(response.getBody());

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while processing the image");
        }
    }

    //ocr
    @PostMapping("/process")
    public ResponseEntity<?> uploadReceipt(@RequestParam("image") MultipartFile image) {
        try {
            // Convert the MultipartFile to a byte array
            byte[] imageBytes = image.getBytes();

            // Set up HTTP headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            // Set up request body (Multipart file)
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("image", new ByteArrayResource(imageBytes) {
                @Override
                public String getFilename() {
                    return image.getOriginalFilename();
                }
            });

            // Set up HttpEntity
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // Send POST request to Flask server
            ResponseEntity<String> response = restTemplate.exchange(
                    FLASK_URL,  // Correctly use the Flask server URL here
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            // Return Flask server response to the client
            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error during receipt detection: " + e.getMessage());
        }
    }
}