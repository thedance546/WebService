// src/services/AdminApi.js
import { api, getAuthHeaders, handleApiError } from "./Api";

// 카테고리 관련 API
export const fetchCategories = async () => {
  try {
    const response = await api.get("/items/categories", {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, "카테고리 데이터를 불러오는 중 오류 발생");
  }
};

export const createCategory = async (categoryName) => {
  try {
    const response = await api.post("/items/category", { categoryName }, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, "카테고리 생성 중 오류 발생");
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    await api.delete(`/items/category/${categoryId}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    throw handleApiError(error, "카테고리 삭제 중 오류 발생");
  }
};

// 보관 방법 관련 API
export const fetchStorageMethods = async () => {
  try {
    const response = await api.get("/items/storage-methods", {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, "보관 방법 데이터를 불러오는 중 오류 발생");
  }
};

export const createStorageMethod = async (methodName) => {
  try {
    const response = await api.post("/items/storage-method", { storageMethodName: methodName }, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, "보관 방법 생성 중 오류 발생");
  }
};

export const deleteStorageMethod = async (methodId) => {
  try {
    await api.delete(`/items/storage-method/${methodId}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    throw handleApiError(error, "보관 방법 삭제 중 오류 발생");
  }
};

// 식재료 관련 API
export const fetchItems = async () => {
  try {
    const response = await api.get("/items", {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, "식재료 데이터를 불러오는 중 오류 발생");
  }
};

export const createItem = async (item) => {
  try {
    const response = await api.post("/items/item", item, {
      //headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, "식재료 생성 중 오류 발생");
  }
};

export const deleteItem = async (itemId) => {
  try {
    await api.delete(`/items/item/${itemId}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    throw handleApiError(error, "식재료 삭제 중 오류 발생");
  }
};
