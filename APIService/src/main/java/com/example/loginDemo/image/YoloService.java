package com.example.loginDemo.image;

import io.jsonwebtoken.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
public class YoloService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${yolo.api.url}")
    private String yoloApiUrl;

    public String sendImageToYolo(MultipartFile imageFile) throws IOException {
        // 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // 파일을 Multipart로 변환
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("image", imageFile.getResource());

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        // YOLO Flask API로 POST 요청 전송
        ResponseEntity<String> response = restTemplate.exchange(yoloApiUrl, HttpMethod.POST, requestEntity, String.class);

        // 결과 반환
        return response.getBody();
    }
}
