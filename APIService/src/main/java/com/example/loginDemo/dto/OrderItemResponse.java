package com.example.loginDemo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@Getter @Setter
public class OrderItemResponse {
    private Long orderItemId;
    private LocalDate orderDate;
    private String itemName;
    private String categoryName;
    private String storageMethodName;
    private Integer sellByDays;
    private Integer useByDays;
    private int count;

}