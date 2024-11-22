package com.example.loginDemo.controller;

import com.example.loginDemo.domain.Item;
import com.example.loginDemo.dto.ItemRequest;
import com.example.loginDemo.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class ItemController {
    private final ItemService itemService;

    // 식재료 등록
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Item> createItem(@RequestBody ItemRequest itemRequest) {
        Item createdItem = itemService.createItem(itemRequest);
        return ResponseEntity.status(201).body(createdItem);
    }
}
