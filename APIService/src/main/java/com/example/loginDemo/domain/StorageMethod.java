package com.example.loginDemo.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "storage_methods")
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class StorageMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "storage_method_id", updatable = false)
    private Long id;

    @Column(name = "storage_method_name", nullable = false, unique = true)
    private String storageMethodName;

    public StorageMethod(String storageMethodName) {
        this.storageMethodName = storageMethodName;
    }
}
