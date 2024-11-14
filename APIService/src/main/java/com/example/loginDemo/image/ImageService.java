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

    public String sendImageToYolo(MultipartFile imageFile) throws IOException {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // 파일을 Multipart로 변환
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("image", imageFile.getResource());

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        // YOLO Flask API로 POST 요청 전송
        ResponseEntity<Map> response = restTemplate.exchange(yoloApiUrl, HttpMethod.POST, requestEntity, Map.class);

        // response.getBody()에서 name만 추출
        Map<String, Object> responseBody = response.getBody();
        if (responseBody != null && responseBody.containsKey("detections")) {
            List<Map<String, Object>> detections = (List<Map<String, Object>>) responseBody.get("detections");
            List<String> names = new ArrayList<>();

            // "name" 값만 추출하여 리스트에 추가
            for (Map<String, Object> detection : detections) {
                if (detection.containsKey("name")) {
                    names.add((String) detection.get("name"));
                }
            }

            // names 리스트 반환 (JSON 형식으로)
            return String.join(", ", names);  // names를 문자열로 합쳐서 반환
        }

        return "No objects detected";
    }
}
