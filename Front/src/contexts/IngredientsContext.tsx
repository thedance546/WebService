// src/contexts/IngredientsContext.tsx

import React, { ReactNode, createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchOrders, deleteUserIngredient } from "../services/ServiceApi";
import { Ingredient } from "../types/EntityTypes";

interface IngredientsContextType {
  ingredients: Ingredient[];
  addIngredient: (newIngredients: Ingredient[]) => void;
  updateIngredient: (updatedIngredient: Ingredient) => void;
  deleteIngredient: (ingredientId: number) => Promise<void>;
  refreshIngredients: () => Promise<void>;
}

const IngredientsContext = createContext<IngredientsContextType | undefined>(undefined);

export const IngredientsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const mapOrderToIngredients = (orders: any[]): Ingredient[] => {
    return orders.map((orderItem) => ({
      ingredientId: orderItem.orderItemId,
      name: orderItem.itemName,
      quantity: 1,
      category: {
        id: orderItem.categoryId || undefined, // id가 없으면 undefined
        categoryName: orderItem.categoryName || "카테고리 없음",
      },
      storageMethod: {
        id: orderItem.storageMethodId || undefined, // id가 없으면 undefined
        storageMethodName: orderItem.storageMethodName || "보관 방법 없음",
      },
      shelfLife: orderItem.sellByDays
        ? calculateDate(orderItem.orderDate, orderItem.sellByDays)
        : undefined,
      consumeBy: orderItem.useByDays
        ? calculateDate(orderItem.orderDate, orderItem.useByDays)
        : undefined,
      purchaseDate: orderItem.orderDate,
    }));
  };
  
  const refreshIngredients = useCallback(async () => {
    try {
      const orders = await fetchOrders();
      const formattedIngredients = mapOrderToIngredients(orders);
      setIngredients(formattedIngredients);
    } catch (error) {
      console.error("식재료 데이터 가져오기 실패:", error);
    }
  }, []); // 빈 배열로 한 번만 초기화

  const deleteIngredient = async (ingredientId: number) => {
    try {
      await deleteUserIngredient(ingredientId);
      setIngredients((prev) => prev.filter((ingredient) => ingredient.ingredientId !== ingredientId));
      console.log(`식재료 삭제 성공: ID=${ingredientId}`);
    } catch (error) {
      console.error("식재료 삭제 실패:", error);
      throw new Error("식재료 삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    refreshIngredients();
  }, [refreshIngredients]);

  return (
    <IngredientsContext.Provider
      value={{
        ingredients,
        addIngredient: (newIngredients) => setIngredients((prev) => [...prev, ...newIngredients]),
        updateIngredient: (updatedIngredient) =>
          setIngredients((prev) =>
            prev.map((ingredient) =>
              ingredient.ingredientId === updatedIngredient.ingredientId ? updatedIngredient : ingredient
            )
          ),
        deleteIngredient,
        refreshIngredients,
      }}
    >
      {children}
    </IngredientsContext.Provider>
  );
};

export const useIngredients = (): IngredientsContextType => {
  const context = useContext(IngredientsContext);
  if (!context) {
    throw new Error("useIngredients는 IngredientsProvider 내에서만 사용 가능합니다.");
  }
  return context;
};

const calculateDate = (baseDate: string, daysToAdd: number | undefined): string | undefined => {
  if (!daysToAdd) return undefined;
  const date = new Date(baseDate);
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split("T")[0];
};
