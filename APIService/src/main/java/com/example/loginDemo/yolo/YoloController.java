package com.example.loginDemo.yolo;

import com.example.loginDemo.dto.MultipartFileRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class YoloController {
    private final YoloService yoloService;
    private final String Ingredient_URL = "http://yolo-container:5000/object-detection/object_detection";

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

    //ingredient-image
    @PostMapping("/process")
    public ResponseEntity<byte[]> processIngredientImage(@RequestParam("image") MultipartFile image) throws IOException {
        // Flask 서버에 보낼 이미지 준비
        byte[] imageBytes = image.getBytes();

        // RestTemplate을 사용하여 Flask 서버로 이미지 전송
        RestTemplate restTemplate = new RestTemplate();

        // 헤더 설정 (이미지 파일을 보내는 경우)
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // 이미지 파일을 포함한 요청 본문 설정
        MultipartFileRequest request = new MultipartFileRequest(imageBytes);

        // Flask 서버에 이미지 전송
        ResponseEntity<byte[]> response = restTemplate.exchange(
                Ingredient_URL + "/object-detection/object_detection",
                HttpMethod.POST,
                request,
                byte[].class
        );

        if (response.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(response.getBody());
        } else {
            return ResponseEntity.status(response.getStatusCode()).body(null);
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

    //receipt
    @PostMapping("/receipts")
    public ResponseEntity<Map<String, Object>> processImage(@RequestParam("image") MultipartFile imageFile) {
        try {
            Map<String, Object> response = yoloService.processReceiptImage(imageFile);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to process image"));
        }
    }
}