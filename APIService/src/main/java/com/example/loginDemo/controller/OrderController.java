package com.example.loginDemo.controller;

import com.example.loginDemo.service.OrderService;
import com.example.loginDemo.dto.OrderRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create-from-json")
    public ResponseEntity<?> createOrderFromJson(@RequestBody OrderRequestDTO orderRequestDTO, @RequestParam Long userId) {
        try {
            orderService.createOrderFromJson(orderRequestDTO, userId);
            return ResponseEntity.ok("Order created successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
