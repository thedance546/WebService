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

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestHeader("Authorization") String accessToken,@RequestBody OrderRequest orderRequest) {
        try {
            // 주문 생성
            var order = orderService.createOrder(orderRequest);

            // 생성된 주문을 응답으로 반환
            return new ResponseEntity<>(order, HttpStatus.CREATED);
        } catch (Exception e) {
            // 예외 발생 시 오류 메시지 반환
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // 모든 주문 조회 API
    @GetMapping
    public List<Order> getAllOrders(@RequestHeader("Authorization") String accessToken) {
        return orderService.getAllOrders();
    }
}
