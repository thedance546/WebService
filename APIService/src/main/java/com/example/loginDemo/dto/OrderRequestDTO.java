package com.example.loginDemo.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderRequestDTO {

    private String orderDate;
    private List<OrderItemRequestDto> orderItems;

    @Getter
    @Setter
    public static class OrderItemRequestDto {
        private String itemName;
        private int count;
    }
}
