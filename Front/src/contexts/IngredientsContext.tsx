// src/contexts/IngredientsContext.tsx

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Ingredient } from "../types/EntityTypes";

interface IngredientsContextType {
  ingredients: Ingredient[];
  categories: string[];
  activeTab: string;
  setActiveTab: (category: string) => void;
  addIngredient: (newIngredients: Ingredient[]) => void;
  updateIngredient: (updatedIngredient: Ingredient) => void;
  deleteIngredient: (ingredientId: number) => void;
}

const IngredientsContext = createContext<IngredientsContextType | undefined>(undefined);

export const IngredientsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [categories] = useState<string[]>(["전체", "채소", "가공식품"]);
  const [activeTab, setActiveTab] = useState<string>("전체");

  const addIngredient = (newIngredients: Ingredient[]) => {
    setIngredients((prev) => [...prev, ...newIngredients]);
  };

  const updateIngredient = (updatedIngredient: Ingredient) => {
    setIngredients((prev) =>
      prev.map((ingredient) =>
        ingredient.ingredientId === updatedIngredient.ingredientId
          ? updatedIngredient
          : ingredient
      )
    );
  };

  const deleteIngredient = (ingredientId: number) => {
    setIngredients((prev) => prev.filter((ingredient) => ingredient.ingredientId !== ingredientId));
  };

  return (
    <IngredientsContext.Provider
      value={{
        ingredients,
        categories,
        activeTab,
        setActiveTab,
        addIngredient,
        updateIngredient,
        deleteIngredient,
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
