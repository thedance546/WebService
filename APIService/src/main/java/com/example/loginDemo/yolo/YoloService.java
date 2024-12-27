package com.example.loginDemo.yolo;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class YoloService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String Ingredient_URL = "http://localhost:5000/object-detection/object_detection";
    private final String Receipt_URL = "http://localhost:5001/object-detection/ocr_detection";

    // ingredient
    public Map<String, String> detectObjects(MultipartFile imageFile) throws IOException {
        return sendPostRequest(Ingredient_URL, imageFile.getBytes(), imageFile.getOriginalFilename());
    }

    // ocr
    public Map<String, Object> processImage(MultipartFile imageFile) throws IOException {
        return sendPostRequest(Receipt_URL, imageFile.getBytes(), imageFile.getOriginalFilename());
    }


    // 공통 메서드
    private <T> Map sendPostRequest(String url, byte[] imageBytes, String filename) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("image", new ByteArrayResource(imageBytes) {
            @Override
            public String getFilename() {
                return filename;
            }
        });

        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            } else {
                throw new RuntimeException("요청 실패: 상태 코드 " + response.getStatusCode());
            }
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Flask 서버와의 통신에 실패했습니다.", e);
        }
    }
}
