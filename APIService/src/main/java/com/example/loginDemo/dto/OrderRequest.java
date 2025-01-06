package com.example.loginDemo.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Data
public class OrderRequest {
    private LocalDate orderDate;
    private List<OrderItemRequest> orderItems;
}