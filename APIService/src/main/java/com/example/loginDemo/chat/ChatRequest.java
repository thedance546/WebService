package com.example.loginDemo.chat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// 사용자의 요청 메시지를 담는 DTO.
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    private String message;
}
