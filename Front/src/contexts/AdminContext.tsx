// src/contexts/AdminContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  fetchCategories,
  fetchStorageMethods,
  fetchItems,
  createCategory,
  deleteCategory,
  createStorageMethod,
  deleteStorageMethod,
} from "../services/AdminApi";

// 카테고리와 보관 방법, 아이템의 타입 정의
interface Category {
  id: number;
  name: string;
}

interface StorageMethod {
  id: number;
  name: string;
}

interface Item {
  id: number;
  name: string;
  category: Category;
  storageMethod: StorageMethod;
}

interface AdminContextProps {
  categories: Category[];
  storageMethods: StorageMethod[];
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  loading: boolean;
  error: string;
  handleAddCategory: (categoryName: string) => Promise<void>;
  handleDeleteCategory: (categoryId: number) => Promise<void>;
  handleAddStorageMethod: (methodName: string) => Promise<void>;
  handleDeleteStorageMethod: (methodId: number) => Promise<void>;
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [storageMethods, setStorageMethods] = useState<StorageMethod[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [initialized, setInitialized] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Fetching data...");
      const [categoriesData, storageMethodsData, itemsData] = await Promise.all([
        fetchCategories(),
        fetchStorageMethods(),
        fetchItems(),
      ]);
      setCategories(categoriesData);
      setStorageMethods(storageMethodsData);
      setItems(itemsData);
      setError("");
      setInitialized(true);
      console.log("Data fetched successfully");
    } catch (err) {
      console.error("Data fetch failed:", err);
      setError("데이터를 불러오는 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (categoryName: string) => {
    try {
      const newCategory = await createCategory(categoryName);
      setCategories([...categories, newCategory]);
    } catch (error) {
      console.error("카테고리 추가 중 오류 발생:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await deleteCategory(categoryId);
      setCategories(categories.filter((category) => category.id !== categoryId));
    } catch (error) {
      console.error("카테고리 삭제 중 오류 발생:", error);
    }
  };

  const handleAddStorageMethod = async (methodName: string) => {
    try {
      const newMethod = await createStorageMethod(methodName);
      setStorageMethods([...storageMethods, newMethod]);
    } catch (error) {
      console.error("보관 방법 추가 중 오류 발생:", error);
    }
  };

  const handleDeleteStorageMethod = async (methodId: number) => {
    try {
      await deleteStorageMethod(methodId);
      setStorageMethods(storageMethods.filter((method) => method.id !== methodId));
    } catch (error) {
      console.error("보관 방법 삭제 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    if (!initialized) {
      fetchData();
    }
  }, [initialized]);

  return (
    <AdminContext.Provider
      value={{
        categories,
        storageMethods,
        items,
        setItems,
        loading,
        error,
        handleAddCategory,
        handleDeleteCategory,
        handleAddStorageMethod,
        handleDeleteStorageMethod,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminContext must be used within an AdminProvider");
  }
  return context;
};
