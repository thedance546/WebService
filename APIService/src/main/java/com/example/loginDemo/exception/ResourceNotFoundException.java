package com.example.loginDemo.exception;

public class ResourceNotFoundException extends RuntimeException{
    // 기본 생성자
    public ResourceNotFoundException() {
        super();
    }

    // 메시지를 인자로 받는 생성자
    public ResourceNotFoundException(String message) {
        super(message);
    }

    // 메시지와 원인 예외를 인자로 받는 생성자
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    // 원인 예외를 인자로 받는 생성자
    public ResourceNotFoundException(Throwable cause) {
        super(cause);
    }
}
