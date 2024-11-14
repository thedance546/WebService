package com.example.loginDemo.chat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

// 사용자의 요청 메시지를 담는 DTO.
@Getter @Setter
@AllArgsConstructor
public class ChatRequest {
    private String question;
    private String searchResults;  // 기본값을 빈 문자열로 설정 가능

    public ChatRequest() {
        this.searchResults = ""; // 기본값 설정
    }
}
