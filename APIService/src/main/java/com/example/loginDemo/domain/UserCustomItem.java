package com.example.loginDemo.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "user_custom_items")
public class UserCustomItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_custom_item_id", updatable = false)
    private Long id;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "count", nullable = false)
    @Min(0)
    private int count;

    @Column(name = "category_name", nullable = false)
    private String categoryName;

    @Column(name = "storage_method_name")
    private String storageMethodName;

    @Column(name = "sell_by_days", nullable = false)
    private int sellByDays;

    @Column(name = "use_by_days", nullable = false)
    private int useByDays;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;
}