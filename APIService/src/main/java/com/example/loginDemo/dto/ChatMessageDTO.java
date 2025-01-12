package com.example.loginDemo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatMessageDTO {
    private Long id;
    private String question;
    private String response;
}
