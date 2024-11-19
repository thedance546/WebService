package com.example.loginDemo.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "shelf_lifes")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class ShelfLife {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shelf_life_id", updatable = false)
    private Long id;

    @Column(name = "sell_by_date", nullable = false)
    private LocalDate sellByDate;  // 유통기한

    @Column(name = "use_by_date", nullable = false)
    private LocalDate useByDate;   // 소비기한
}
