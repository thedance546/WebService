// src/hooks/useCategory.js
import useResource from "./useResource";
import { fetchCategories, createCategory, deleteCategory } from "../services/AdminApi";

const useCategory = () => useResource(fetchCategories, createCategory, deleteCategory);

export default useCategory;