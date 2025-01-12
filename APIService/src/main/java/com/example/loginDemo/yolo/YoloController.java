package com.example.loginDemo.yolo;

import ch.qos.logback.core.model.Model;
import com.example.loginDemo.dto.DetectionResponse;
import com.example.loginDemo.dto.ReceiptResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.http.*;
import org.springframework.http.converter.FormHttpMessageConverter;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;


import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class YoloController {
    private final YoloService yoloService;

    //ingredient
    @PostMapping("/items/detection")
    public ResponseEntity<DetectionResponse> detectAndReturn(@RequestHeader("Authorization") String accessToken,@RequestParam("image") MultipartFile imageFile) {
        try {
            // 객체 감지 결과 가져오기
            Map<String, String> detectionResults = yoloService.detectObjects(imageFile);

            // 바운딩 박스를 그린 결과 이미지 가져오기
            byte[] resultImage = yoloService.returnImage(imageFile);

            // Base64로 인코딩
            String base64Image = Base64.getEncoder().encodeToString(resultImage);
            String imageDataUri = "data:image/jpeg;base64," + base64Image;

            // DTO 생성
            DetectionResponse response = new DetectionResponse(detectionResults, imageDataUri);

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }


    // 확인할 품목 리스트
    private static final List<String> ITEMS_TO_CHECK = Arrays.asList(
            "김치", "토마토", "방울토마토", "가지", "오이", "애호박", "팽이버섯", "새송이버섯",
            "돼지고기", "닭고기", "소고기", "두부", "콩나물", "대파", "양파", "마늘", "시금치",
            "고추", "깻잎", "당근", "감자", "고구마", "계란", "무", "파프리카",
            "배추", "열무", "고춧가루", "참기름", "들기름", "간장", "된장", "고추장",
            "우유", "치즈", "버터", "요거트", "생수", "탄산수", "콜라", "사이다", "주스",
            "라면", "국수", "스파게티", "케첩", "마요네즈", "소금", "후추", "설탕",
            "빵", "참치캔", "스팸", "햄", "소세지",
            "생선", "고등어", "갈치", "오징어","라면",
            "미역", "다시마", "멸치", "김", "젓갈", "새우", "조개", "굴",
            "감귤", "배", "포도", "바나나", "키위", "복숭아", "자두", "딸기", "체리", "블루베리",
            "아몬드", "호두", "땅콩", "캐슈넛", "아보카도", "레몬", "라임",
            "쌀", "생 돼지고기", "비엔나 소시지", "사과", "게 맛살", "어묵", "생 소고기", "생 닭고기"
    );

    // receipt
    @PostMapping("/receipts")
    public ResponseEntity<ReceiptResponse> processImage(@RequestParam("image") MultipartFile imageFile) {
        try {
            // 이미지를 처리하고 ReceiptResponse 객체를 받음
            ReceiptResponse receiptResponse = yoloService.processReceiptImage(imageFile);

            // 처리된 결과를 ReceiptResponse로 반환
            return ResponseEntity.ok(receiptResponse);
        } catch (IOException e) {
            // 오류 발생 시, 오류 메시지를 포함한 ReceiptResponse 반환
            return ResponseEntity.status(500).body(new ReceiptResponse(null, List.of("Failed to process image")));
        }
    }

}