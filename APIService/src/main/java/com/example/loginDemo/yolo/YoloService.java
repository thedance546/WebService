package com.example.loginDemo.yolo;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class YoloService {
    private final RestTemplate restTemplate = new RestTemplate();
//    private final String Ingredient_URL = "http://localhost:5000/object-detection/object_detection";
//    private final String Receipt_URL = "http://localhost:5001/object-detection/ocr_detection";
    private final String Ingredient_URL = "http://yolo-container:5000/object-detection/object_detection";
    private final String flaskServerUrl = "http://yolo-container:5000";
    private final String Receipt_URL = "http://receipt-container:5001/ocr-detection";


    // ingredient
    public Map<String, String> detectObjects(MultipartFile imageFile) throws IOException {
        return sendPostRequest(Ingredient_URL, imageFile.getBytes(), imageFile.getOriginalFilename());
    }

    //이미지 리턴
    // 2. 처리된 이미지 리턴
    public ResponseEntity<byte[]> getProcessedImage(MultipartFile file) {
        try {
            // 이미지 바이트 배열로 변환
            byte[] imageBytes = file.getBytes();

            // 이미지 파일을 포함한 HttpEntity 생성
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("image", new ByteArrayResource(imageBytes) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();  // 파일 이름 설정
                }
            });

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // 처리된 이미지 반환
            ResponseEntity<byte[]> response = restTemplate.exchange(
                    flaskServerUrl + "/object-detection/object_detection",
                    HttpMethod.POST,
                    requestEntity,
                    byte[].class
            );

            // 이미지 바이트 배열을 로컬에 저장
            byte[] imageBytesFromResponse = response.getBody();

            // 고유한 파일 이름 생성 (타임스탬프 또는 UUID 사용)
            String uniqueFileName = "processed_image_" + UUID.randomUUID().toString() + ".jpg";  // UUID를 이용해 고유한 파일 이름 생성
            String filePath = "C:/WorkSpace/" + uniqueFileName;  // 이미지 저장 경로 설정

            File imageFile = new File(filePath);
            try (FileOutputStream fos = new FileOutputStream(imageFile)) {
                fos.write(imageBytesFromResponse);  // 이미지 바이트 데이터를 파일로 저장
            } catch (IOException e) {
                e.printStackTrace();
            }

            return response;
        } catch (HttpServerErrorException e) {
            throw new RuntimeException("Server error while processing image: " + e.getMessage(), e);
        } catch (ResourceAccessException e) {
            throw new RuntimeException("Error accessing Flask server: " + e.getMessage(), e);
        } catch (IOException e) {
            throw new RuntimeException("Error reading image file: " + e.getMessage(), e);
        }
    }

    // ocr
    public Map<String, Object> processReceiptImage(MultipartFile imageFile) throws IOException {
        Map<String, Object> response = sendPostRequest(Receipt_URL, imageFile.getBytes(), imageFile.getOriginalFilename());

        List<String> items = (List<String>) response.get("품목");
        Set<String> matchedItemsSet = matchItems(items);

        if (!matchedItemsSet.isEmpty()) {
            response.put("matchedItems", new ArrayList<>(matchedItemsSet)); // Convert Set to List
        } else {
            response.put("matchedItems", "No matched items");
        }

        return response;
    }

    private Set<String> matchItems(List<String> items) {
        Set<String> matchedItemsSet = new HashSet<>();
        List<String> ITEMS_TO_CHECK = Arrays.asList(
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

        for (String item : items) {
            for (String checkItem : ITEMS_TO_CHECK) {
                if (item.contains(checkItem)) {
                    matchedItemsSet.add(checkItem);
                }
            }
        }
        return matchedItemsSet;
    }

    // 공통 POST 메서드
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
