// src/hooks/useCategory.ts

import useResource from "./useResource";
import { fetchCategories, createCategory, deleteCategory } from "../services/AdminApi";

export interface Category {
  id: string;
  categoryName: string;
}

const useCategory = () =>
  useResource<Category>(fetchCategories, createCategory, deleteCategory);

export default useCategory;
