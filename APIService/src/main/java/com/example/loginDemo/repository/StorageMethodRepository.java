package com.example.loginDemo.repository;

import com.example.loginDemo.domain.StorageMethod;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StorageMethodRepository extends JpaRepository<StorageMethod, Long> {
    Optional<StorageMethod> findByStorageMethodName(String storageMethodName);
}
