package com.example.loginDemo.image;

import io.jsonwebtoken.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ImageService {

    private final RestTemplate restTemplate = new RestTemplate();
    private String yoloApiUrl = "http://localhost:5000/detect";  // YOLO Flask API URL

    public Map<String, Object> sendImageToYolo(MultipartFile imageFile) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // Convert the image file to multipart form-data
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("image", imageFile.getResource());

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        // Sending POST request to YOLO Flask API
        ResponseEntity<Map> response = restTemplate.exchange(yoloApiUrl, HttpMethod.POST, requestEntity, Map.class);

        // Return the entire response body
        return response.getBody();  // Return the response map directly
    }
}