package com.example.loginDemo.service;

import com.example.loginDemo.domain.Category;
import com.example.loginDemo.domain.Item;
import com.example.loginDemo.domain.ShelfLife;
import com.example.loginDemo.domain.StorageMethod;
import com.example.loginDemo.dto.ItemRequest;
import com.example.loginDemo.repository.CategoryRepository;
import com.example.loginDemo.repository.ItemRepository;
import com.example.loginDemo.repository.ShelfLifeRepository;
import com.example.loginDemo.repository.StorageMethodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ItemService {
    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final StorageMethodRepository storageMethodRepository;
    private final ShelfLifeRepository shelfLifeRepository;

    // 식재료 등록 (ItemRequest DTO 사용)
    public Item createItem(ItemRequest itemRequest) {
        // 카테고리와 보관 방법 찾기 (이름으로 검색)
        Category category = categoryRepository.findByCategoryName(itemRequest.getCategoryName())
                .orElseThrow(() -> new IllegalArgumentException("Invalid category name"));

        StorageMethod storageMethod = storageMethodRepository.findByStorageMethodName(itemRequest.getStorageMethodName())
                .orElseThrow(() -> new IllegalArgumentException("Invalid storage method name"));

        // ShelfLife 객체 생성 후 저장
        ShelfLife shelfLife = new ShelfLife(itemRequest.getSellByDays(), itemRequest.getUseByDays());
        shelfLife = shelfLifeRepository.save(shelfLife);  // ShelfLife 저장

        // Item 객체 생성 후 저장
        Item item = new Item(itemRequest.getItemName(), category, storageMethod, shelfLife);
        return itemRepository.save(item);  // Item 저장
    }

}
