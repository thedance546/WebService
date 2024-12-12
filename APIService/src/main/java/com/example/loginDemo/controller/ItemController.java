package com.example.loginDemo.controller;

import com.example.loginDemo.domain.Category;
import com.example.loginDemo.domain.Item;
import com.example.loginDemo.domain.StorageMethod;
import com.example.loginDemo.dto.ItemRequest;
import com.example.loginDemo.service.CategoryService;
import com.example.loginDemo.service.ItemService;
import com.example.loginDemo.service.StorageMethodService;
import jakarta.validation.constraints.NotNull;
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
public class ItemController {
    private final ItemService itemService;
    private final CategoryService categoryService;
    private final StorageMethodService storageMethodService;

    //등록
    @PostMapping("/category")
    public ResponseEntity<?> createCategory(@RequestBody Category category) {
        try {
            Category createdCategory = categoryService.createCategory(category.getCategoryName());
            return ResponseEntity.ok(createdCategory);
        } catch (IllegalArgumentException ex) {
            // 예외 발생 시 JSON 형식으로 메시지 리턴
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"message\": \"" + ex.getMessage() + "\"}");
        }
    }

    @PostMapping("/storage-method")
    public ResponseEntity<?> createStorageMethod(@RequestBody StorageMethod storageMethod) {
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

    @PostMapping("/item")
    public ResponseEntity<?> createItem(@RequestBody ItemRequest itemRequest) {
        try {
            Item item = itemService.createItem(itemRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(item);  // 생성된 아이템 반환
        } catch (IllegalArgumentException ex) {
            // 중복된 itemName에 대한 예외 처리
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"message\": \"" + ex.getMessage() + "\"}");  // 에러 메시지 반환
        }
    }

    //조회
    @GetMapping("/categories")
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();  // CategoryService에서 모든 카테고리 조회
    }

    @GetMapping("/storage-methods")
    public List<StorageMethod> getAllStorageMethods() {
        return storageMethodService.getAllStorageMethods();  // StorageMethodService에서 모든 보관 방법 조회
    }

    @GetMapping
    public List<Item> getAllItems() {
        return itemService.getAllItems();  // ItemService의 getAllItems() 호출
    }

    //삭제
    @DeleteMapping("/category/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/storage-method/{id}")
    public ResponseEntity<Void> deleteStorageMethod(@PathVariable Long id) {
        storageMethodService.deleteStorageMethod(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }



}
