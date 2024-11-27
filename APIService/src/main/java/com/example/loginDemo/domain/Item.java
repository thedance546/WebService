package com.example.loginDemo.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "items")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id", updatable = false)
    private Long id;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @OneToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToOne
    @JoinColumn(name = "storage_method_id", nullable = false)
    private StorageMethod storageMethod;

    @OneToOne
    @JoinColumn(name = "shelf_life_id", nullable = false)
    private ShelfLife shelfLife;


}
