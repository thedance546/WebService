package com.example.loginDemo.controller;

import com.example.loginDemo.domain.User;
import com.example.loginDemo.service.OrderService;
import com.example.loginDemo.dto.OrderRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/order")
    public ResponseEntity<?> createOrder(
            @AuthenticationPrincipal User user, // 로그인된 사용자
            @RequestBody OrderRequest orderRequest) {

        try {
            // 로그인된 사용자의 userId를 orderRequest에 자동 설정
            orderRequest.setUserId(user.getId());

            // 주문 생성 서비스 호출
            orderService.createOrder(orderRequest);

            return ResponseEntity.ok("Order created successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }


}
