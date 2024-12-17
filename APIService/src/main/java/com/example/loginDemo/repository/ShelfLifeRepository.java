package com.example.loginDemo.repository;

import com.example.loginDemo.domain.ShelfLife;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShelfLifeRepository extends JpaRepository<ShelfLife, Long> {
}
