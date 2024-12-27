// src/hooks/useCategory.ts

import useResource from "./useResource";
import { fetchCategories, createCategory, deleteCategory } from "../services/AdminApi";
import { Category } from "../types/EntityTypes";

const useCategory = () => {
  return useResource<Category>(
    fetchCategories,
    async (category: Omit<Category, "id">) => {
      const newCategory = await createCategory(category.name);
      return { id: newCategory.id, name: newCategory.name };
    },
    deleteCategory
  );
};

export default useCategory;
