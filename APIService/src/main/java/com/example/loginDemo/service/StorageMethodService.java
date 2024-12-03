package com.example.loginDemo.service;

import com.example.loginDemo.domain.StorageMethod;
import com.example.loginDemo.repository.StorageMethodRepository;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StorageMethodService {
    private final StorageMethodRepository storageMethodRepository;

    // 보관 방법 생성
    public StorageMethod createStorageMethod(String storageMethodName) {
        StorageMethod storageMethod = new StorageMethod(storageMethodName);
        return storageMethodRepository.save(storageMethod);
    }

    // 보관 방법 이름으로 조회
    public StorageMethod findByStorageMethodName(String storageMethodName) {
        // Optional에서 값을 꺼내고, 없을 경우 예외 처리
        return storageMethodRepository.findByStorageMethodName(storageMethodName)
                .orElseThrow(() -> new IllegalArgumentException("Storage method not found: " + storageMethodName));
    }

    // 모든 보관 방법 조회
    public List<StorageMethod> getAllStorageMethods() {
        return storageMethodRepository.findAll();
    }

    //삭제
    public void deleteStorageMethod(Long id) {
        storageMethodRepository.deleteById(id);
    }

}
