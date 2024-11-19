package com.example.loginDemo.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "storage_methods")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class StorageMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "storage_method_id", updatable = false)
    private Long id;

    @Column(name = "storage_method", nullable = false)
    private String storageMethod;


}
