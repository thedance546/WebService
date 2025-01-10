package com.example.loginDemo.yolo;

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

    private final String Ingredient_bounding_URL = "http://yolo-container:5000/object-detection/object_detection/image";

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
    @PostMapping("/image")
    public ResponseEntity<byte[]> returnImage(@RequestParam("image") MultipartFile file) {
        try {
            System.out.println("Starting image processing...");  // 이미지 처리 시작 로그

            // RestTemplate에 Multipart 처리용 HttpMessageConverter 추가
            RestTemplate restTemplate = new RestTemplate();
            List<HttpMessageConverter<?>> converters = new ArrayList<>(restTemplate.getMessageConverters());
            converters.add(new FormHttpMessageConverter());  // FormHttpMessageConverter 추가
            converters.add(new StringHttpMessageConverter());  // 기본 String converter 추가
            restTemplate.setMessageConverters(converters);  // RestTemplate에 converter 설정

            // 이미지를 Flask 서버로 전송
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            System.out.println("Headers set: " + headers);  // 헤더 설정 로그

            // MultipartFile을 HttpEntity로 변환하여 Flask 서버로 전송
            HttpEntity<MultipartFile> entity = new HttpEntity<>(file, headers);
            System.out.println("Entity created with file: " + file.getOriginalFilename());  // 파일 정보 로그

            ResponseEntity<byte[]> response = restTemplate.exchange(
                    Ingredient_bounding_URL,
                    HttpMethod.POST,
                    entity,
                    byte[].class
            );
            System.out.println("Response status: " + response.getStatusCode());  // 응답 상태 로그

            // Flask 서버에서 반환된 이미지 데이터 반환
            if (response.getStatusCode() == HttpStatus.OK) {
                System.out.println("Image received successfully from Flask server.");  // 성공 로그
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(response.getBody());
            } else {
                System.out.println("Failed to receive image from Flask server. Status: " + response.getStatusCode());  // 오류 로그
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }

        } catch (Exception e) {
            // RestTemplate에서 발생할 수 있는 예외 처리
            System.out.println("Error occurred while processing image: " + e.getMessage());  // 예외 로그
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
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