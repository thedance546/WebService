// src/features/MyIngredients/IngredientFilter.tsx

import React, { useMemo } from "react";
import { Ingredient } from "../../types/EntityTypes";
import { IngredientStatus } from "../../types/FeatureTypes";
import { calculateStatus } from "../../utils/Utils";

interface IngredientFilterProps {
  ingredients: Ingredient[];
  activeSort: string;
  sortDirection: boolean;
  onFilter: (filteredIngredients: Ingredient[]) => void;
}

const IngredientFilter: React.FC<IngredientFilterProps> = ({
  ingredients,
  activeSort,
  sortDirection,
  onFilter,
}) => {
  const getStatusPriority = (ingredient: Ingredient): number => {
    const status = calculateStatus(ingredient);
    switch (status) {
      case IngredientStatus.Expired:
        return 1;
      case IngredientStatus.Caution:
        return 2;
      case IngredientStatus.Safe:
        return 3;
      default:
        return 4;
    }
  };

  const filteredIngredients = useMemo(() => {
    let sorted = [...ingredients];
    switch (activeSort) {
      case "status":
        sorted.sort((a, b) => {
          const aPriority = getStatusPriority(a);
          const bPriority = getStatusPriority(b);
          return sortDirection ? aPriority - bPriority : bPriority - aPriority;
        });
        break;
      case "name":
        sorted.sort((a, b) => {
          const comparison = a.name.localeCompare(b.name);
          return sortDirection ? comparison : -comparison;
        });
        break;
      case "quantity":
        sorted.sort((a, b) =>
          sortDirection ? b.quantity - a.quantity : a.quantity - b.quantity
        );
        break;
    }
    return sorted;
  }, [activeSort, sortDirection, ingredients]);

  React.useEffect(() => {
    onFilter(filteredIngredients);
  }, [filteredIngredients, onFilter]);

  return null;
};

export default IngredientFilter;
