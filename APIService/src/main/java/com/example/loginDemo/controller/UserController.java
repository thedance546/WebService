package com.example.loginDemo.controller;

import com.example.loginDemo.domain.User;
import com.example.loginDemo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    //모든 회원 조회
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(@RequestHeader("Authorization") String accessToken) {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    //회원 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@RequestHeader("Authorization") String accessToken, @PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.ok("회원이 성공적으로 삭제되었습니다.");
    }
}
