// src/types/EntityTypes.ts

export interface Category {
    id?: number;
    categoryName: string;
}

export interface StorageMethod {
    id?: number;
    storageMethodName: string;
}

export interface ShelfLife {
    id: number;
    sellByDays: number;
    useByDays: number;
}

export interface Item {
    id: number;
    itemName: string;
    category?: Category;
    storageMethod?: StorageMethod;
    shelfLife?: ShelfLife;
}

export interface User {
    id: string;
    name: string;
    email: string;
    username: string;
}

export interface Ingredient {
    ingredientId: number;
    name: string;
    quantity: number;
    category?: Category;
    storageMethod?: StorageMethod;
    shelfLife?: string; // 유통기한 날짜 (YYYY-MM-DD)
    consumeBy?: string; // 소비기한 날짜 (YYYY-MM-DD)
    purchaseDate?: string; // 구매일자 (YYYY-MM-DD)
}
