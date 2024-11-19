package com.example.loginDemo.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "p_ingredients")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class PurchasedIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "p_ingredient_id", updatable = false)
    private Long id;

    @NotBlank
    @Column(name = "p_ingredient_name", nullable = false)
    private String purchasedIngredientName;

    @Column(name = "p_date", nullable = false)
    private LocalDate purchaseDate;

    //User 연관관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    //Ingredient 연관관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_id", nullable = false)
    private Ingredient ingredient;

    @Builder
    public PurchasedIngredient(String purchasedIngredientName, LocalDate purchaseDate, User user, Ingredient ingredient) {
        this.purchasedIngredientName = purchasedIngredientName;
        this.purchaseDate = purchaseDate;
        this.user = user;
        this.ingredient = ingredient;
    }

}
