package com.example.loginDemo.service;

import com.example.loginDemo.domain.Item;
import com.example.loginDemo.domain.Order;
import com.example.loginDemo.domain.OrderItem;
import com.example.loginDemo.dto.OrderItemRequest;
import com.example.loginDemo.dto.OrderRequest;
import com.example.loginDemo.repository.ItemRepository;
import com.example.loginDemo.repository.OrderItemRepository;
import com.example.loginDemo.repository.OrderRepository;
import com.example.loginDemo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    @Transactional
    public Map<String, String> createOrder(OrderRequest orderRequest) {
        // 주문을 생성
        Order order = new Order();
        order.setOrderDate(orderRequest.getOrderDate());

        // OrderItems 생성
        List<OrderItem> orderItems = orderRequest.getOrderItems().stream()
                .map(this::convertToOrderItem)  // OrderItem 생성
                .collect(Collectors.toList());

        // OrderItem들과 연결
        order.setOrderItems(orderItems);

        // 주문을 저장하고, 그 후 order_id가 자동으로 설정됨
        order = orderRepository.save(order);

        // Order와 OrderItem들을 연결 (이제 order의 ID가 존재)
        for (OrderItem orderItem : orderItems) {
            orderItem.setOrder(order);  // Order와 연결
        }

        // 연결된 OrderItems 다시 저장
        orderItemRepository.saveAll(orderItems);

        return createResponse("Order created successfully!");
    }

    private Map<String, String> createResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return response;
    }

    private OrderItem convertToOrderItem(OrderItemRequest orderItemRequest) {
        Optional<Item> optionalItem = itemRepository.findByItemName(orderItemRequest.getItemName());
        Item item = optionalItem.orElseThrow(() -> new RuntimeException("Item with name " + orderItemRequest.getItemName() + " not found"));

        OrderItem orderItem = new OrderItem();
        orderItem.setItem(item);
        orderItem.setCount(orderItemRequest.getCount());

        return orderItem;
    }

    // 모든 주문 조회
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
