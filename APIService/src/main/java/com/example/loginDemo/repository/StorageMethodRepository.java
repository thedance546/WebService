package com.example.loginDemo.repository;

import com.example.loginDemo.domain.StorageMethod;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StorageMethodRepository extends JpaRepository<StorageMethod, Long> {
}
