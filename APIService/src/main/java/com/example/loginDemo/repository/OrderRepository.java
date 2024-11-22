package com.example.loginDemo.repository;

import com.example.loginDemo.domain.Order;
import com.example.loginDemo.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
}
