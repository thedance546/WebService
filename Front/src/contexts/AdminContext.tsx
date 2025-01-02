// src/contexts/AdminContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  fetchCategories as apiFetchCategories,
  createCategory as apiCreateCategory,
  deleteCategory as apiDeleteCategory,
  fetchStorageMethods as apiFetchStorageMethods,
  createStorageMethod as apiCreateStorageMethod,
  deleteStorageMethod as apiDeleteStorageMethod,
  fetchItems as apiFetchItems,
  createItem as apiCreateItem,
  deleteItem as apiDeleteItem,
} from '../services/AdminApi';
import { Category, StorageMethod, Item } from '../types/EntityTypes';

interface AdminContextType {
  categories: Category[];
  storageMethods: StorageMethod[];
  items: Item[];
  loading: boolean;
  error: string | null;
  fetchAllData: () => void;
  addCategory: (name: string) => void;
  deleteCategory: (id: number) => void;
  addStorageMethod: (name: string) => void;
  deleteStorageMethod: (id: number) => void;
  addItem: (item: Item) => void;
  deleteItem: (id: number) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [storageMethods, setStorageMethods] = useState<StorageMethod[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [fetchedCategories, fetchedStorageMethods, fetchedItems] = await Promise.all([
        apiFetchCategories(),
        apiFetchStorageMethods(),
        apiFetchItems(),
      ]);
      setCategories(fetchedCategories);
      setStorageMethods(fetchedStorageMethods);
      setItems(fetchedItems);
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
      setError(`카테고리를 추가하는 중 오류 발생: ${err.message || '알 수 없는 오류'}`);
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
      setError(`카테고리를 삭제하는 중 오류 발생: ${err.message || '알 수 없는 오류'}`);
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
      setError(`보관 방법을 추가하는 중 오류 발생: ${err.message || '알 수 없는 오류'}`);
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
      setError(`보관 방법을 삭제하는 중 오류 발생: ${err.message || '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (ingredient: Item) => {
    setLoading(true);
    try {
      const newIngredient = await apiCreateItem(ingredient);
      setItems((prev) => [...prev, newIngredient]);
    } catch (err: any) {
      setError(`식재료를 추가하는 중 오류 발생: ${err.message || '알 수 없는 오류'}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: number) => {
    setLoading(true);
    try {
      await apiDeleteItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      setError(`아이템을 삭제하는 중 오류 발생: ${err.message || '알 수 없는 오류'}`);
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
        items,
        loading,
        error,
        fetchAllData,
        addCategory,
        deleteCategory,
        addStorageMethod,
        deleteStorageMethod,
        addItem,
        deleteItem,
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
