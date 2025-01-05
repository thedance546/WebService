package com.example.loginDemo.repository;

import com.example.loginDemo.domain.Message;
import com.example.loginDemo.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByUser(User user);
}
