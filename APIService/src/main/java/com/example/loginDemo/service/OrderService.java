package com.example.loginDemo.service;

import com.example.loginDemo.domain.Item;
import com.example.loginDemo.domain.Order;
import com.example.loginDemo.domain.OrderItem;
import com.example.loginDemo.domain.User;
import com.example.loginDemo.dto.OrderRequestDTO;
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

    @Transactional
    public Order createOrderFromJson(OrderRequestDTO orderRequestDto, Long userId) {
        // User 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 주문 생성
        Order order = new Order();
        order.setOrderDate(LocalDate.parse(orderRequestDto.getOrderDate()));
        order.setUser(user);
        orderRepository.save(order);

        // 품목 처리
        List<OrderRequestDTO.OrderItemRequestDto> orderItems = orderRequestDto.getOrderItems();
        for (OrderRequestDTO.OrderItemRequestDto itemRequest : orderItems) {
            String itemName = itemRequest.getItemName();
            Item item = itemRepository.findByItemName(itemName)
                    .orElseThrow(() -> new IllegalArgumentException("Item not found: " + itemName));

            // OrderItem 생성 및 저장
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setItem(item);
            orderItem.setCount(itemRequest.getCount());
            orderItemRepository.save(orderItem);
        }

        return order;
    }


}
