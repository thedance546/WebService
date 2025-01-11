package com.example.loginDemo.yolo;

import ch.qos.logback.core.model.Model;
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
    public ResponseEntity<Map<String, String>> detectObjects(@RequestParam("image") MultipartFile imageFile) {
        try {
            Map<String, String> detectionResults = yoloService.detectObjects(imageFile);
            return ResponseEntity.ok(detectionResults);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null); // 내부 서버 오류
        }
    }

    //yolo 바운딩 박스 리턴
    @PostMapping("/items/bounding-box")
    public ResponseEntity<String> detectObjectsImage(@RequestParam("image") MultipartFile imageFile) {
        try {
            // 이미지를 보내고 바운딩 박스를 그린 결과 이미지를 반환
            byte[] resultImage = yoloService.returnImage(imageFile);

            // Base64로 인코딩하여 응답
            String base64Image = Base64.getEncoder().encodeToString(resultImage);
            String imageDataUri = "data:image/jpeg;base64," + base64Image;

            return ResponseEntity.ok(imageDataUri);  // Base64 형식으로 반환
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error processing image");  // 서버 오류
        }
    }

    // 확인할 품목 리스트
    private static final List<String> ITEMS_TO_CHECK = Arrays.asList(
            "김치", "토마토", "방울토마토", "가지", "오이", "애호박", "팽이버섯", "새송이버섯",
            "돼지고기", "닭고기", "소고기", "두부", "콩나물", "대파", "양파", "마늘", "시금치",
            "고추", "깻잎", "당근", "감자", "고구마", "계란", "무", "파프리카", "게맛살", "쌀",
            "어묵", "사과", "비엔나 소세지",
            "배추", "열무", "고춧가루", "참기름", "들기름", "간장", "된장", "고추장",
            "우유", "치즈", "버터", "요거트", "생수", "탄산수", "콜라", "사이다", "주스",
            "라면", "국수", "스파게티", "케첩", "마요네즈", "소금", "후추", "설탕",
            "빵", "크림빵", "소시지빵", "햄버거빵", "도넛", "떡", "떡볶이떡", "찹쌀떡",
            "참치캔", "스팸", "햄", "소세지", "해물믹스", "생선", "고등어", "갈치", "오징어",
            "미역", "다시마", "멸치", "김", "젓갈", "새우", "조개", "굴",
            "감귤", "배", "포도", "바나나", "키위", "복숭아", "자두", "딸기", "체리", "블루베리",
            "아몬드", "호두", "땅콩", "캐슈넛", "아보카도", "레몬", "라임"
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