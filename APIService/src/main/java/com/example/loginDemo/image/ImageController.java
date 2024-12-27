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
    private final String yoloApiUrl = "http://yolo-container:5000/v1/object-detection/image_team6/{modelName}";
//    private final String FLASK_URL = "http://localhost:5001/object-detection/ocr_detection";
    private final String FLASK_URL = "http://receipt-container:5001/object-detection/ocr_detection";
    private final String chatBotApiUrl = "";  // LLM 챗봇 API URL

    //yolo
    @PostMapping("/send")
    public ResponseEntity<List<ObjectDetectionDTO>> detectObjects(@RequestParam("image") MultipartFile imageFile) {
        try {
            // Flask API로 보낼 데이터 구성
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("image", new MultipartInputStreamFileResource(imageFile.getInputStream(), imageFile.getOriginalFilename()));

            // HTTP 요청 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            // 요청 생성
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // Flask API 호출
            ResponseEntity<Map> response = restTemplate.exchange(
                    yoloApiUrl.replace("{modelName}", "yolov5s"),
                    HttpMethod.POST,
                    requestEntity,
                    Map.class
            );

            // Map을 List<ObjectDetectionDTO>로 변환
            Map<String, String> detectedObjects = response.getBody();
            List<ObjectDetectionDTO> objectDetectionDTOList = new ArrayList<>();

            // Map을 순회하며 DTO 객체로 변환
            for (Map.Entry<String, String> entry : detectedObjects.entrySet()) {
                objectDetectionDTOList.add(new ObjectDetectionDTO(entry.getKey(), entry.getValue()));
            }

            // 성공적인 응답 반환
            return ResponseEntity.ok(objectDetectionDTOList);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of(new ObjectDetectionDTO("error", "Failed to process image")));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of(new ObjectDetectionDTO("error", "Unexpected error occurred")));
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