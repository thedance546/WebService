package com.example.loginDemo.exception;

//JWT가 유효하지 않은 경우
public class InvalidTokenException extends RuntimeException {
    public InvalidTokenException(String message) {
        super(message);
    }
}
