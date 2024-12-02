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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/items")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class ItemController {
    private final ItemService itemService;
    private final CategoryService categoryService;
    private final StorageMethodService storageMethodService;

    // 카테고리 등록
    @PostMapping("/category")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        Category createdCategory = categoryService.createCategory(category.getCategoryName());
        return ResponseEntity.ok(createdCategory);
    }

    // 보관방법 등록
    @PostMapping("/storage-method")
    public ResponseEntity<StorageMethod> createStorageMethod(@RequestBody StorageMethod storageMethod) {
        StorageMethod createdStorageMethod = storageMethodService.createStorageMethod(storageMethod.getStorageMethodName());
        return ResponseEntity.ok(createdStorageMethod);
    }

    // 식재료 등록
    @PostMapping("/item")
    public ResponseEntity<Item> createItem(@RequestBody ItemRequest itemRequest) {
        Item item = itemService.createItem(itemRequest);
        return ResponseEntity.ok(item);
    }

}
