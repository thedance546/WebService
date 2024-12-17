package com.example.loginDemo.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IngredientDto {
    // YOLO 모델에서 식재료 탐지 결과를 받아오고, GPT로 전달하는 dto

    private List<String> ingredients;  // 탐지된 식재료 목록
}
