package com.example.loginDemo.service;

import com.example.loginDemo.domain.Item;
import com.example.loginDemo.domain.Order;
import com.example.loginDemo.domain.OrderItem;
import com.example.loginDemo.domain.User;
import com.example.loginDemo.dto.OrderRequest;
import com.example.loginDemo.repository.ItemRepository;
import com.example.loginDemo.repository.OrderItemRepository;
import com.example.loginDemo.repository.OrderRepository;
import com.example.loginDemo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

//    @Transactional
//    public Order createOrder(OrderRequest orderRequest) {
//        // Order 생성 및 저장
//        Order order = new Order();
//        order.setOrderDate(orderRequest.getOrderDate());
//        Order savedOrder = orderRepository.save(order);
//
//        // OrderItems 생성 및 저장
//        for (OrderRequest.OrderItemRequest orderItemRequest : orderRequest.getOrderItems()) {
//            // Item 조회
//            Item item = itemRepository.findByItemName(orderItemRequest.getItemName())
//                    .orElseThrow(() -> new IllegalArgumentException("Invalid item name: " + orderItemRequest.getItemName()));
//
//            OrderItem orderItem = new OrderItem();
//            orderItem.setOrder(savedOrder);
//            orderItem.setItem(item);
//            orderItem.setCount(orderItemRequest.getCount());
//
//            orderItemRepository.save(orderItem);
//        }
//
//        return savedOrder;
//    }

    @Transactional
    public Order createOrder(OrderRequest orderRequest) {
        // userId를 통해 User 객체를 조회
        User user = userRepository.findById(orderRequest.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Order 생성 및 저장
        Order order = new Order();
        order.setOrderDate(orderRequest.getOrderDate());
        order.setUser(user); // User 설정
        Order savedOrder = orderRepository.save(order);

        // OrderItems 생성 및 저장
        for (OrderRequest.OrderItemRequest orderItemRequest : orderRequest.getOrderItems()) {
            // Item 조회
            Item item = itemRepository.findByItemName(orderItemRequest.getItemName())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid item name: " + orderItemRequest.getItemName()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setItem(item);
            orderItem.setCount(orderItemRequest.getCount());

            orderItemRepository.save(orderItem);
        }

        return savedOrder;
    }

}
