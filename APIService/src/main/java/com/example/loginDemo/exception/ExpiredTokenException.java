package com.example.loginDemo.exception;

//토큰이 만료된 경우
public class ExpiredTokenException extends RuntimeException {
    public ExpiredTokenException(String message) {
        super(message);
    }
}