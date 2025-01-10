package com.example.loginDemo.controller;

import com.example.loginDemo.domain.Order;
import com.example.loginDemo.domain.OrderItem;
import com.example.loginDemo.domain.User;
import com.example.loginDemo.service.OrderService;
import com.example.loginDemo.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // 주문 생성
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest, @RequestHeader("Authorization") String accessToken) {
        String token = extractToken(accessToken);

        orderService.createOrder2(orderRequest, token);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // 유저별 식재료 조회
    @GetMapping("/user/items")
    public ResponseEntity<List<OrderItemResponse>> getUserItems(@RequestHeader("Authorization") String accessToken) {
        String token = extractToken(accessToken);
        return ResponseEntity.ok(orderService.findItemsByUser(token));
    }

    // 유저가 주문 아이템 삭제
    @DeleteMapping("/items/{orderItemId}")
    public ResponseEntity<String> deleteOrderItemByUser(
            @PathVariable Long orderItemId,
            @RequestHeader("Authorization") String accessToken) {
        try {
            String token = extractToken(accessToken);
            orderService.deleteOrderItemByUser(orderItemId, token);
            return ResponseEntity.ok("Order item deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 추출 메서드
    private String extractToken(String accessToken) {
        return accessToken.replace("Bearer ", "");
    }
}
