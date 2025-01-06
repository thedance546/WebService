package com.example.loginDemo.service;

import com.example.loginDemo.domain.Item;
import com.example.loginDemo.domain.Order;
import com.example.loginDemo.domain.OrderItem;
import com.example.loginDemo.domain.User;
import com.example.loginDemo.dto.OrderItemRequest;
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
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ItemRepository itemRepository;

    @Transactional
    public Order createOrder(OrderRequest orderRequest) {
        // 새로운 Order 객체 생성
        Order order = new Order();
        order.setOrderDate(orderRequest.getOrderDate());

        // OrderItemRequest 리스트를 OrderItem 객체 리스트로 변환
        List<OrderItem> orderItems = orderRequest.getOrderItems().stream()
                .map(this::convertToOrderItem)  // convertToOrderItem 메서드를 사용하여 변환
                .collect(Collectors.toList());

        // 각 OrderItem에 대해 Item을 이름으로 찾아 설정
        for (OrderItem orderItem : orderItems) {
            String itemName = orderItem.getItem().getName();  // orderItem에서 Item 이름 가져오기
            Optional<Item> optionalItem = itemRepository.findByItemName(itemName);  // Item 이름으로 찾기

            // Item이 존재하는지 확인
            Item item = optionalItem.orElseThrow(() -> new RuntimeException("Item with name " + itemName + " not found"));

            orderItem.setItem(item);  // Item 설정
        }

        // Order와 OrderItem 저장
        order.setOrderItems(orderItems);
        return orderRepository.save(order);  // Order 저장 후 반환
    }

    // OrderItemRequest를 OrderItem 객체로 변환하는 메서드
    private OrderItem convertToOrderItem(OrderItemRequest orderItemRequest) {
        // Item 이름으로 Item 객체 찾기
        Optional<Item> optionalItem = itemRepository.findByItemName(orderItemRequest.getItemName());
        Item item = optionalItem.orElseThrow(() -> new RuntimeException("Item with name " + orderItemRequest.getItemName() + " not found"));

        // OrderItem 객체 생성 및 설정
        OrderItem orderItem = new OrderItem();
        orderItem.setItem(item);  // Item 설정
        orderItem.setCount(orderItemRequest.getCount());  // 수량 설정

        return orderItem;
    }
}
