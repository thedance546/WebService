package com.example.loginDemo.controller;

import com.example.loginDemo.domain.Category;
import com.example.loginDemo.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items/categories")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestHeader("Authorization") String accessToken,
                                            @RequestBody Category category) {
        try {
            Category createdCategory = categoryService.createCategory(category.getCategoryName());
            return ResponseEntity.ok(createdCategory);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"message\": \"" + ex.getMessage() + "\"}");
        }
    }

    @GetMapping
    public List<Category> getAllCategories(@RequestHeader("Authorization") String accessToken) {
        return categoryService.getAllCategories();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@RequestHeader("Authorization") String accessToken,@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
