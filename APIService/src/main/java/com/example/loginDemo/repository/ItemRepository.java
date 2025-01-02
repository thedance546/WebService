package com.example.loginDemo.repository;

import com.example.loginDemo.domain.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
    boolean existsByItemName(String itemName);
    void deleteByCategoryId(Long categoryId);
    void deleteByStorageMethodId(Long storageMethodId);
}
