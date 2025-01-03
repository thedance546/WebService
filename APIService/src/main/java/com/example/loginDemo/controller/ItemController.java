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
import java.util.Map;

@RestController
@RequestMapping("/api/items")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class ItemController {
    private final ItemService itemService;

    @PostMapping("/item")
    public ResponseEntity<?> createItem(@RequestHeader("Authorization") String accessToken,
                                        @RequestBody ItemRequest itemRequest) {
        try {
            Item item = itemService.createItem(itemRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(item);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"message\": \"" + ex.getMessage() + "\"}");
        }
    }

    @GetMapping
    public List<Item> getAllItems(@RequestHeader("Authorization") String accessToken) {
        return itemService.getAllItems();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@RequestHeader("Authorization") String accessToken, @PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
