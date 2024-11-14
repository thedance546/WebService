package com.example.loginDemo.chat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//Flask에서 반환된 챗봇 응답을 사용자에게 전달할 때 사용하는 DTO.
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    private String answer;

}
