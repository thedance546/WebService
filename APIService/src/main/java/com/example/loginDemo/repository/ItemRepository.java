package com.example.loginDemo.repository;

import com.example.loginDemo.domain.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item, Long> {
    Optional<Item> findByItemName(String itemName);
    boolean existsByItemName(String itemName);
    void deleteByCategoryId(Long categoryId);
    void deleteByStorageMethodId(Long storageMethodId);
}
