package com.example.loginDemo.controller;

import com.example.loginDemo.domain.StorageMethod;
import com.example.loginDemo.service.StorageMethodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class StorageMethodController {
    private final StorageMethodService storageMethodService;

    @PostMapping("/storage-method")
    public ResponseEntity<?> createStorageMethod(@RequestHeader("Authorization") String accessToken,
                                                 @RequestBody StorageMethod storageMethod) {
        try {
            // 중복 체크 및 보관 방법 생성
            StorageMethod createdStorageMethod = storageMethodService.createStorageMethod(storageMethod.getStorageMethodName());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdStorageMethod);
        } catch (IllegalArgumentException ex) {
            // 예외 발생 시 JSON 형식으로 메시지 리턴
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"message\": \"" + ex.getMessage() + "\"}");
        }
    }

    @GetMapping("/storage-methods")
    public List<StorageMethod> getAllStorageMethods(@RequestHeader("Authorization") String accessToken) {
        return storageMethodService.getAllStorageMethods();  // StorageMethodService에서 모든 보관 방법 조회
    }

    @DeleteMapping("/storage-method/{id}")
    public ResponseEntity<Void> deleteStorageMethod(@RequestHeader("Authorization") String accessToken, @PathVariable Long id) {
        storageMethodService.deleteStorageMethod(id);
        return ResponseEntity.noContent().build();
    }
}
