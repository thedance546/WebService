package com.example.loginDemo.yolo;

import com.example.loginDemo.domain.Item;
import com.example.loginDemo.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/image")
@RequiredArgsConstructor
public class YoloController {
    private final YoloService yoloService;

    //ingredient
    @PostMapping("/detect")
    public ResponseEntity<Map<String, String>> detectObjects(@RequestParam("image") MultipartFile imageFile) {
        try {
            Map<String, String> detectionResults = yoloService.detectObjects(imageFile);
            return ResponseEntity.ok(detectionResults);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null); // 내부 서버 오류
        }
    }

    // 확인할 품목 리스트
    private static final List<String> ITEMS_TO_CHECK = Arrays.asList(
            "김치", "토마토", "방울토마토", "가지", "오이", "애호박", "팽이버섯", "새송이버섯",
            "돼지고기", "닭고기", "소고기", "두부", "콩나물", "대파", "양파", "마늘", "시금치",
            "고추", "깻잎", "당근", "감자", "고구마", "계란", "무", "파프리카", "게맛살", "쌀",
            "어묵", "사과", "비엔나 소세지"
    );

    //receipt
    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> processImage(@RequestParam("image") MultipartFile imageFile) {
        try {
            Map<String, Object> response = yoloService.processImage(imageFile);

            // 품목 리스트를 가져온다.
            List<String> items = (List<String>) response.get("품목");

            // ITEMS_TO_CHECK에 해당하는 품목을 찾는다.
            Set<String> matchedItemsSet = new HashSet<>();
            for (String item : items) {
                for (String checkItem : ITEMS_TO_CHECK) {
                    if (item.contains(checkItem)) {
                        matchedItemsSet.add(checkItem);
                    }
                }
            }

            // 일치하는 품목이 있다면 matchedItemsSet에 담겨있다.
            if (!matchedItemsSet.isEmpty()) {
                response.put("matchedItems", new ArrayList<>(matchedItemsSet)); // Set을 List로 변환하여 추가
            } else {
                response.put("matchedItems", "No matched items");
            }

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to process image"));
        }
    }
}