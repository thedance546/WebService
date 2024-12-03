package com.example.loginDemo.repository;

import com.example.loginDemo.domain.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {
    void deleteByCategoryId(Long categoryId);
    void deleteByStorageMethodId(Long storageMethodId);
}
