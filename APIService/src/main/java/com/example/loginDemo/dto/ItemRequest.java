package com.example.loginDemo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ItemRequest {
    private String name; //식재료명
    private Long categoryId; // 카테고리 ID
    private Long storageMethodId;  // 보관 방법 ID
    private ShelfLifeDto shelfLife;
}
