package com.example.loginDemo.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "items")
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id", updatable = false)
    private Long id;

    @Column(name = "item_name", nullable = false, unique = true)
    private String itemName;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "storage_method_id", nullable = false)
    private StorageMethod storageMethod;

    @ManyToOne
    @JoinColumn(name = "shelf_life_id", nullable = false)
    private ShelfLife shelfLife;

    public Item(String itemName, Category category, StorageMethod storageMethod, ShelfLife shelfLife) {
        this.itemName = itemName;
        this.category = category;
        this.storageMethod = storageMethod;
        this.shelfLife = shelfLife;
    }

    public String getName() {
        return itemName;
    }

}
