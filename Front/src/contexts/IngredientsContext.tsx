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

  const refreshIngredients = async () => {
    try {
      const orders = await fetchOrders();
      const formattedIngredients = mapOrderToIngredients(orders);
      setIngredients(formattedIngredients);
    } catch (error) {
      console.error("식재료 데이터 가져오기 실패:", error);
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
        deleteIngredient: (ingredientId) =>
          setIngredients((prev) => prev.filter((ingredient) => ingredient.ingredientId !== ingredientId)),
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
  return orders.flatMap((order) =>
    order.orderItems.map((orderItem: any) => ({
      ingredientId: orderItem.item.id,
      name: orderItem.item.itemName,
      quantity: orderItem.count,
      category: {
        id: orderItem.item.category.id,
        categoryName: orderItem.item.category.categoryName,
      },
      storageMethod: {
        id: orderItem.item.storageMethod.id,
        storageMethodName: orderItem.item.storageMethod.storageMethodName,
      },
      shelfLife: calculateDate(order.orderDate, orderItem.item.shelfLife?.sellByDays),
      consumeBy: calculateDate(order.orderDate, orderItem.item.shelfLife?.useByDays),
      purchaseDate: order.orderDate,
    }))
  );
};

const calculateDate = (baseDate: string, daysToAdd: number | undefined): string | undefined => {
  if (!daysToAdd) return undefined;
  const date = new Date(baseDate);
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split("T")[0];
};
