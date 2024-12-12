//package com.example.loginDemo;
//
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.context.annotation.Profile;
//
//import static org.assertj.core.api.Assertions.assertThat;
//
//@Profile("test")
//@SpringBootTest
//public class CreateJwtTest {
//
//    @Value("${security.secret.key}")
//    private String secret_key;
//
//    @Test
//    void 시크릿키_존재_확인(){
//        assertThat(secret_key).isNotNull();
//    }
//}
