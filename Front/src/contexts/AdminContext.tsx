// src/contexts/AdminContext.tsx

import React, { createContext, useContext, ReactNode } from "react";
import useCategory from "../hooks/useCategory";
import useStorageMethod from "../hooks/useStorageMethod";
import useItem from "../hooks/useItem";
import { Category, StorageMethod, Item } from "../types/EntityTypes";

interface AdminContextProps {
  categories: Category[];
  storageMethods: StorageMethod[];
  items: Item[];
  handleAddCategory: (categoryName: string) => Promise<void>;
  handleDeleteCategory: (categoryId: number) => Promise<void>;
  handleAddStorageMethod: (methodName: string) => Promise<void>;
  handleDeleteStorageMethod: (methodId: number) => Promise<void>;
  addItem: (item: Omit<Item, "id">) => Promise<void>;
  deleteItem: (itemId: number) => Promise<void>;
  loading: boolean;
  error: string;
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    resources: categories,
    addResource: addCategory,
    removeResource: deleteCategory,
    loading: categoryLoading,
    error: categoryError,
  } = useCategory();

  const {
    resources: storageMethods,
    addResource: addStorageMethod,
    removeResource: deleteStorageMethod,
    loading: storageMethodLoading,
    error: storageMethodError,
  } = useStorageMethod();

  const {
    resources: items,
    addResource: addItem,
    removeResource: deleteItem,
    loading: itemLoading,
    error: itemError,
  } = useItem();

  const handleAddCategory = async (categoryName: string) => {
    await addCategory({ name: categoryName });
  };

  const handleDeleteCategory = async (categoryId: number) => {
    await deleteCategory(categoryId);
  };

  const handleAddStorageMethod = async (methodName: string) => {
    await addStorageMethod({ name: methodName });
  };

  const handleDeleteStorageMethod = async (methodId: number) => {
    await deleteStorageMethod(methodId);
  };

  const loading = categoryLoading || storageMethodLoading || itemLoading;
  const error = categoryError || storageMethodError || itemError;

  return (
    <AdminContext.Provider
      value={{
        categories,
        storageMethods,
        items,
        handleAddCategory,
        handleDeleteCategory,
        handleAddStorageMethod,
        handleDeleteStorageMethod,
        addItem,
        deleteItem,
        loading,
        error,
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

