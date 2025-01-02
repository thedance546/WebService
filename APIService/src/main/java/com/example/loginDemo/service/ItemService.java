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
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {
    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final StorageMethodRepository storageMethodRepository;
    private final ShelfLifeRepository shelfLifeRepository;

    public Item createItem(ItemRequest itemRequest) {
        // 중복된 itemName이 존재하는지 확인
        if (itemRepository.existsByItemName(itemRequest.getItemName())) {
            throw new IllegalArgumentException("이미 존재하는 식재료 이름입니다.");
        }

        Category category = categoryRepository.findByCategoryName(itemRequest.getCategoryName())
                .orElseThrow(() -> new IllegalArgumentException("Invalid category name"));
        StorageMethod storageMethod = storageMethodRepository.findByStorageMethodName(itemRequest.getStorageMethodName())
                .orElseThrow(() -> new IllegalArgumentException("Invalid storage method name"));
        ShelfLife shelfLife = new ShelfLife(itemRequest.getSellByDays(), itemRequest.getUseByDays());
        shelfLife = shelfLifeRepository.save(shelfLife);  // ShelfLife 저장

        Item item = new Item(itemRequest.getItemName(), category, storageMethod, shelfLife);
        return itemRepository.save(item);  // Item 저장
    }

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }

    @Transactional
    public void deleteItemsByCategoryId(Long categoryId) {
        itemRepository.deleteByCategoryId(categoryId);
    }

    @Transactional
    public void deleteItemsByStorageMethodId(Long storageMethodId) {
        itemRepository.deleteByStorageMethodId(storageMethodId);
    }

}
