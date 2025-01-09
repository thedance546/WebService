// src/contexts/IngredientsContext.tsx

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { fetchOrders } from "../services/ServiceApi";
import { Ingredient } from "../types/EntityTypes";

interface IngredientsContextType {
  ingredients: Ingredient[];
  addIngredient: (newIngredients: Ingredient[]) => void;
  updateIngredient: (updatedIngredient: Ingredient) => void;
  deleteIngredient: (ingredientId: number) => void;
  refreshIngredients: () => Promise<void>;
}

const IngredientsContext = createContext<IngredientsContextType | undefined>(undefined);

export const IngredientsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  // 서버에서 데이터를 가져와 상태를 갱신하는 함수
  const refreshIngredients = async () => {
    try {
      const orders = await fetchOrders(); // 주문 데이터 가져오기
      const formattedIngredients = mapOrderToIngredients(orders); // 데이터 변환
      setIngredients(formattedIngredients); // 상태 갱신
    } catch (error) {
      console.error("식재료 데이터 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    // 페이지 처음 진입 시 데이터 로드
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
              ingredient.ingredientId === updatedIngredient.ingredientId
                ? updatedIngredient
                : ingredient
            )
          ),
        deleteIngredient: (ingredientId) =>
          setIngredients((prev) => prev.filter((ingredient) => ingredient.ingredientId !== ingredientId)),
        refreshIngredients, // 갱신 함수 추가
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
  return orders.flatMap((order) =>
    order.orderItems.map((orderItem: any) => ({
      ingredientId: orderItem.item.id,
      name: orderItem.item.itemName,
      quantity: orderItem.count,
      purchaseDate: order.orderDate,
      categoryId: orderItem.item.category?.id,
      storageMethodId: orderItem.item.storageMethod?.id,
      shelfLife: orderItem.item.shelfLife
        ? calculateDate(order.orderDate, orderItem.item.shelfLife.sellByDays)
        : undefined,
      consumeBy: orderItem.item.shelfLife
        ? calculateDate(order.orderDate, orderItem.item.shelfLife.useByDays)
        : undefined,
    }))
  );
};

// 날짜 계산 함수
const calculateDate = (baseDate: string, daysToAdd: number): string => {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split("T")[0]; // YYYY-MM-DD 포맷
};