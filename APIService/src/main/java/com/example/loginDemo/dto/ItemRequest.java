package com.example.loginDemo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class ItemRequest {
    private String itemName;
    private String categoryName;  // category name을 받음
    private String storageMethodName;  // storage method name을 받음
    private int sellByDays;
    private int useByDays;
}
