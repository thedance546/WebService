// src/contexts/AdminContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  fetchCategories,
  fetchStorageMethods,
  fetchItems,
  createCategory,
  deleteCategory,
  createStorageMethod,
  deleteStorageMethod,
} from "../services/AdminApi";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [storageMethods, setStorageMethods] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [initialized, setInitialized] = useState(false);

  const fetchData = async (retry = 3) => {
    while (retry > 0) {
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
        setError(""); // Clear any previous errors
        setInitialized(true);
        console.log("Data fetched successfully");
        break;
      } catch (err) {
        retry -= 1;
        console.error(`Data fetch failed. Retries left: ${retry}`, err);
        if (retry === 0) {
          setError("데이터를 불러오는 중 오류 발생");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!initialized) {
      fetchData();
    }
  }, [initialized]);

  // 카테고리 추가
  const handleAddCategory = async (categoryName) => {
    try {
      const newCategory = await createCategory(categoryName);
      setCategories([...categories, newCategory]);
    } catch (error) {
      console.error("카테고리 추가 중 오류 발생:", error);
    }
  };

  // 카테고리 삭제
  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      setCategories(categories.filter((category) => category.id !== categoryId));
    } catch (error) {
      console.error("카테고리 삭제 중 오류 발생:", error);
    }
  };

  // 보관 방법 추가
  const handleAddStorageMethod = async (methodName) => {
    try {
      const newMethod = await createStorageMethod(methodName);
      setStorageMethods([...storageMethods, newMethod]);
    } catch (error) {
      console.error("보관 방법 추가 중 오류 발생:", error);
    }
  };

  // 보관 방법 삭제
  const handleDeleteStorageMethod = async (methodId) => {
    try {
      await deleteStorageMethod(methodId);
      setStorageMethods(storageMethods.filter((method) => method.id !== methodId));
    } catch (error) {
      console.error("보관 방법 삭제 중 오류 발생:", error);
    }
  };

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
  return useContext(AdminContext);
};
