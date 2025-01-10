// src/contexts/IngredientsContext.tsx

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { fetchOrders, deleteUserIngredient } from "../services/ServiceApi"; // 삭제 API 추가
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

  const refreshIngredients = async () => {
    try {
      const orders = await fetchOrders();
      const formattedIngredients = mapOrderToIngredients(orders);
      setIngredients(formattedIngredients);
    } catch (error) {
      console.error("식재료 데이터 가져오기 실패:", error);
    }
  };

  const deleteIngredient = async (ingredientId: number) => {
    try {
      await deleteUserIngredient(ingredientId); // API 호출
      setIngredients((prev) => prev.filter((ingredient) => ingredient.ingredientId !== ingredientId));
      console.log(`식재료 삭제 성공: ID=${ingredientId}`);
    } catch (error) {
      console.error("식재료 삭제 실패:", error);
      throw new Error("식재료 삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    refreshIngredients();
  }, []);

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
    throw new Error("useIngredients must be used within an IngredientsProvider");
  }
  return context;
};

export const mapOrderToIngredients = (orders: any[]): Ingredient[] => {
  return orders
    .filter((orderItem) => orderItem.item) // item이 존재하지 않는 항목 필터링
    .map((orderItem) => {
      const item = orderItem.item;

      return {
        ingredientId: orderItem.orderItemId || 0,
        name: item.itemName || "이름 없음",
        quantity: 1,
        category: {
          id: item.category?.id || 0,
          categoryName: item.category?.categoryName || "",
        },
        storageMethod: {
          id: item.storageMethod?.id || 0,
          storageMethodName: item.storageMethod?.storageMethodName || "",
        },
        shelfLife: item.shelfLife?.sellByDays
          ? calculateDate(new Date().toISOString(), item.shelfLife.sellByDays)
          : undefined,
        consumeBy: item.shelfLife?.useByDays
          ? calculateDate(new Date().toISOString(), item.shelfLife.useByDays)
          : undefined,
        purchaseDate: new Date().toISOString(),
      };
    });
};

const calculateDate = (baseDate: string, daysToAdd: number | undefined): string | undefined => {
  if (!daysToAdd) return undefined;
  const date = new Date(baseDate);
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split("T")[0];
};
