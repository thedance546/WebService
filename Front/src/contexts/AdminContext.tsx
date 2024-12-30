// src/contexts/AdminContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  fetchCategories as apiFetchCategories,
  createCategory as apiCreateCategory,
  deleteCategory as apiDeleteCategory,
  fetchStorageMethods as apiFetchStorageMethods,
  createStorageMethod as apiCreateStorageMethod,
  deleteStorageMethod as apiDeleteStorageMethod,
  fetchIngredients as apiFetchIngredients,
  createIngredient as apiCreateIngredient,
  deleteIngredient as apiDeleteIngredient,
} from '../services/AdminApi';
import { Category, StorageMethod, Ingredient } from '../types/EntityTypes';

interface AdminContextType {
  categories: Category[];
  storageMethods: StorageMethod[];
  ingredients: Ingredient[];
  loading: boolean;
  error: string | null;
  fetchAllData: () => void;
  addCategory: (name: string) => void;
  deleteCategory: (id: number) => void;
  addStorageMethod: (name: string) => void;
  deleteStorageMethod: (id: number) => void;
  addIngredient: (ingredient: Partial<Ingredient>) => void;
  deleteIngredient: (id: number) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [storageMethods, setStorageMethods] = useState<StorageMethod[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [fetchedCategories, fetchedStorageMethods, fetchedIngredients] = await Promise.all([
        apiFetchCategories(),
        apiFetchStorageMethods(),
        apiFetchIngredients(),
      ]);
      setCategories(fetchedCategories);
      setStorageMethods(fetchedStorageMethods);
      setIngredients(fetchedIngredients);
      setError(null);
    } catch (err: any) {
      setError('데이터를 불러오는 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (name: string) => {
    setLoading(true);
    try {
      const newCategory = await apiCreateCategory(name);
      setCategories((prev) => [...prev, newCategory]);
    } catch (err: any) {
      setError('카테고리를 추가하는 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    setLoading(true);
    try {
      await apiDeleteCategory(id);
      setCategories((prev) => prev.filter((category) => category.id !== id));
    } catch (err: any) {
      setError('카테고리를 삭제하는 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  const addStorageMethod = async (name: string) => {
    setLoading(true);
    try {
      const newStorageMethod = await apiCreateStorageMethod(name);
      setStorageMethods((prev) => [...prev, newStorageMethod]);
    } catch (err: any) {
      setError('보관 방법을 추가하는 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  const deleteStorageMethod = async (id: number) => {
    setLoading(true);
    try {
      await apiDeleteStorageMethod(id);
      setStorageMethods((prev) => prev.filter((method) => method.id !== id));
    } catch (err: any) {
      setError('보관 방법을 삭제하는 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = async (ingredient: Partial<Ingredient>) => {
    setLoading(true);
    try {
      const newIngredient = await apiCreateIngredient(ingredient);
      setIngredients((prev) => [...prev, newIngredient]);
    } catch (err: any) {
      setError('식재료를 추가하는 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  const deleteIngredient = async (id: number) => {
    setLoading(true);
    try {
      await apiDeleteIngredient(id);
      setIngredients((prev) => prev.filter((ingredient) => ingredient.ingredientId !== id));
    } catch (err: any) {
      setError('식재료를 삭제하는 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        categories,
        storageMethods,
        ingredients,
        loading,
        error,
        fetchAllData,
        addCategory,
        deleteCategory,
        addStorageMethod,
        deleteStorageMethod,
        addIngredient,
        deleteIngredient,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
};
