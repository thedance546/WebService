package com.example.loginDemo.image;


import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api/yolo")
public class ImageController {
    private static final String FLASK_API_URL = "http://localhost:5000/v1/object-detection/yolov5";

    // 이미지 업로드 및 YOLO 모델 결과 요청
    @PostMapping("/predict")
    public ResponseEntity<String> predict(@RequestParam("image") MultipartFile image) {
        try {
            // RestTemplate 객체 생성
            RestTemplate restTemplate = new RestTemplate();

            // 요청의 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            // 이미지 파일을 MultiValueMap에 추가
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("image", image.getResource());

            // 요청 본문 설정
            HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);

            // Flask API에 POST 요청 보내기
            ResponseEntity<String> response = restTemplate.exchange(FLASK_API_URL, HttpMethod.POST, entity, String.class);

            // Flask API의 응답 반환
            return response;

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during image prediction.");
        }
    }
}
