// src/types/EntityTypes.ts

export interface Category {
    id: number;
    name: string;
}

export interface StorageMethod {
    id: number;
    name: string;
}

export interface Item {
    id: number;
    name: string;
    category?: Category;
    storageMethod?: StorageMethod;
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
    shelfLife?: number;
    consumeBy?: number;
    categoryId?: number;
    storageMethodId?: number;
}