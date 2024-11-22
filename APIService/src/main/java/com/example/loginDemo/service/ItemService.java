package com.example.loginDemo.service;

import com.example.loginDemo.domain.Category;
import com.example.loginDemo.domain.Item;
import com.example.loginDemo.domain.ShelfLife;
import com.example.loginDemo.domain.StorageMethod;
import com.example.loginDemo.dto.ItemRequest;
import com.example.loginDemo.dto.ShelfLifeDto;
import com.example.loginDemo.repository.CategoryRepository;
import com.example.loginDemo.repository.ItemRepository;
import com.example.loginDemo.repository.ShelfLifeRepository;
import com.example.loginDemo.repository.StorageMethodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ItemService {
    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final StorageMethodRepository storageMethodRepository;
    private final ShelfLifeRepository shelfLifeRepository;

    @Transactional
    public Item createItem(ItemRequest itemRequest) {
        // category ID로 조회
        Category category = categoryRepository.findById(itemRequest.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        // storageMethod ID로 조회
        StorageMethod storageMethod = storageMethodRepository.findById(itemRequest.getStorageMethodId())
                .orElseThrow(() -> new IllegalArgumentException("StorageMethod not found"));

        // ShelfLifeDto 받아서 ShelfLife 객체로 변환
        ShelfLifeDto shelfLifeDto = itemRequest.getShelfLife();
        ShelfLife shelfLife = new ShelfLife();
        shelfLife.setSellByDays(shelfLifeDto.getSellByDays());
        shelfLife.setUseByDays(shelfLifeDto.getUseByDays());
        shelfLifeRepository.save(shelfLife);

        // 새로운 Item 생성
        Item item = Item.builder()
                .itemName(itemRequest.getName())
                .category(category)
                .storageMethod(storageMethod)
                .shelfLife(shelfLife)
                .build();

        // Item 저장 후 반환
        return itemRepository.save(item);
    }
}
