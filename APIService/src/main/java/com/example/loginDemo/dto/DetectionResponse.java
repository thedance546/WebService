package com.example.loginDemo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class DetectionResponse {
    private Map<String, String> detectionResults; // 객체 감지 결과
    private String imageData; // 이미지 데이터
}
