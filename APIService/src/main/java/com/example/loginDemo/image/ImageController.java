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
    private final RestTemplate restTemplate = new RestTemplate();

    private final String yoloApiUrl = "http://localhost:5000/object-detection/object_detection";
//    private final String yoloApiUrl = "http://yolo-container:5000/object-detection/object_detection";

    private final String FLASK_URL = "http://localhost:5001/object-detection/ocr_detection";
//    private final String FLASK_URL = "http://receipt-container:5001/object-detection/ocr_detection";

    //yolo
    @PostMapping("/detect")
    public ResponseEntity<Map<String, String>> detectObjects(@RequestParam("image") MultipartFile imageFile) {
        try {
            // 이미지를 byte[]로 변환
            byte[] imageBytes = imageFile.getBytes();

            // 파일명과 이미지를 함께 전달
            Map<String, String> detectionResults = detectObjectsInFlask(imageBytes, imageFile.getOriginalFilename());

            return ResponseEntity.ok(detectionResults);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null); // 내부 서버 오류
        }
    }


    private Map<String, String> detectObjectsInFlask(byte[] imageBytes, String filename) {
        // 요청 헤더 설정 (Content-Type을 multipart/form-data로 설정)
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // MultiValueMap을 사용해 이미지를 multipart/form-data 형식으로 준비
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("image", new ByteArrayResource(imageBytes) {
            @Override
            public String getFilename() {
                return filename; // 파일명 설정 (예: "image.jpg")
            }
        });

        // HttpEntity 생성 (헤더와 바디 포함)
        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            // Flask 서버로 POST 요청 보내기
            ResponseEntity<Map> response = restTemplate.exchange(
                    yoloApiUrl, HttpMethod.POST, entity, Map.class);

            return response.getBody(); // 결과 반환
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Flask 서버와의 통신에 실패했습니다.", e);
        }
    }


    //ocr
    @PostMapping("/process")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> processImage(@RequestParam("image") MultipartFile imageFile) throws IOException {
        // Flask 서버로 요청 보낼 RestTemplate 설정
        RestTemplate restTemplate = new RestTemplate();

        // FormData를 생성
        MultiValueMap<String, Object> body = new org.springframework.util.LinkedMultiValueMap<>();
        body.add("image", imageFile.getResource());

        // HTTP 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // 요청 Entity 구성
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        // Flask 서버로 POST 요청
        ResponseEntity<Map> response = restTemplate.exchange(FLASK_URL, HttpMethod.POST, requestEntity, Map.class);

        // Flask 응답 반환
        if (response.getStatusCode() == HttpStatus.OK) {
            return new ResponseEntity<>(response.getBody(), HttpStatus.OK);
        } else {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to process image");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}