package com.example.loginDemo.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Data
public class OrderRequest {
    private Long userId;
    private LocalDate orderDate;
    private List<OrderItemRequest> orderItems;

    @Data
    public static class OrderItemRequest {
        private String itemName;
        private int count;
    }
}