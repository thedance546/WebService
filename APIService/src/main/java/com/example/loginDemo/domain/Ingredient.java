package com.example.loginDemo.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "ingredients")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ingredient_id", updatable = false)
    private Long id;

    @NotBlank
    @Column(name = "ingredient_name", nullable = false, unique = true)
    private String ingredientName;

    @OneToOne
    @JoinColumn(name = "storage_method_id")
    private StorageMethod storageMethod;

    @OneToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToOne
    @JoinColumn(name = "shelf_life_id")
    private ShelfLife shelfLife;

}
