package com.example.loginDemo.service;

import com.example.loginDemo.dto.DetectionResponse;
import com.example.loginDemo.dto.ReceiptResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class YoloService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String Ingredient_URL = "http://yolo-container:5000/object-detection/object_detection";
    private final String Bounding_URL = "http://yolo-container:5000/object-detection/object_detection/image";
    private final String Receipt_URL = "http://receipt-container:5001/ocr-detection";

    // 식재료 인식 + 바운딩 박스 리턴
    public DetectionResponse detectAndReturn(MultipartFile imageFile) throws IOException {
        // 객체 감지 결과 가져오기
        Map<String, String> detectionResults = sendPostRequest(Ingredient_URL, imageFile.getBytes(), imageFile.getOriginalFilename());

        // 바운딩 박스를 그린 결과 이미지 가져오기
        byte[] resultImage = sendPostRequestImage(Bounding_URL, imageFile.getBytes(), imageFile.getOriginalFilename());

        // Base64로 인코딩
        String base64Image = Base64.getEncoder().encodeToString(resultImage);
        String imageDataUri = "data:image/jpeg;base64," + base64Image;

        // DTO 생성하여 반환
        return new DetectionResponse(detectionResults, imageDataUri);
    }

    // 영수증 인식 (OCR)
    public ReceiptResponse processReceiptImage(MultipartFile imageFile) throws IOException {
        Map<String, Object> response = sendPostRequest(Receipt_URL, imageFile.getBytes(), imageFile.getOriginalFilename());

        // '품목' 추출
        List<String> items = (List<String>) response.get("품목");

        // '품목'이 null인 경우 예외 처리
        if (items == null) {
            throw new IllegalArgumentException("영수증에서 인식된 내역이 없습니다.");
        }

        // 아이템 매칭
        Set<String> matchedItemsSet = matchItems(items);

        // 매칭된 아이템이 없으면 "No matched items"로 처리
        List<String> matchedItems = new ArrayList<>(matchedItemsSet);
        if (matchedItems.isEmpty()) {
            matchedItems.add("No matched items");
        }

        String purchaseDateString = (String) response.get("구매일자");
        LocalDate purchaseDate = LocalDate.parse(purchaseDateString, DateTimeFormatter.ofPattern("yy-MM-dd"));

        // ReceiptResponse 객체 생성하여 리턴
        return new ReceiptResponse(purchaseDate, matchedItems);
    }

    private byte[] sendPostRequestImage(String url, byte[] imageBytes, String filename) {
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
            // 이미지 반환을 byte[]로 받기
            ResponseEntity<byte[]> response = restTemplate.exchange(url, HttpMethod.POST, entity, byte[].class);
            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            } else {
                throw new RuntimeException("요청 실패: 상태 코드 " + response.getStatusCode());
            }
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Flask 서버와의 통신에 실패했습니다.", e);
        }
    }

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

    // 영수증에서 인식한 글자와 식품 매치
    private Set<String> matchItems(List<String> items) {
        Set<String> matchedItemsSet = new HashSet<>();
        List<String> ITEMS_TO_CHECK = Arrays.asList(
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

        for (String item : items) {
            for (String checkItem : ITEMS_TO_CHECK) {
                if (item.contains(checkItem)) {
                    matchedItemsSet.add(checkItem);
                }
            }
        }
        return matchedItemsSet;
    }
}
