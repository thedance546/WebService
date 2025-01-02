package com.example.loginDemo.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Data
public class OrderRequest {
    private Long userId;
    private LocalDate orderDate; // 주문 날짜
    private List<OrderItemRequest> orderItems; // 주문 항목 리스트

    @Data
    public static class OrderItemRequest {
        private String itemName; // 아이템 이름
        private int count; // 주문 수량
    }
}