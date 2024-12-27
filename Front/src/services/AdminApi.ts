// src/services/AdminApi.ts

import { api, getAuthHeaders } from './Api';
import { handleApiError } from '../utils/Utils';
import { Category, StorageMethod, Item } from '../types/EntityTypes';

// 카테고리 관련 API
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get<Category[]>("/items/categories", {
      headers: getAuthHeaders('Bearer'),
    });
    return response.data.map((data) => ({
      id: Number(data.id), // 타입 변환
      name: data.name, // 적절한 필드 참조
    }));
  } catch (error: any) {
    throw handleApiError(error, "카테고리 데이터를 불러오는 중 오류 발생");
  }
};

export const createCategory = async (categoryName: string): Promise<Category> => {
  try {
    const response = await api.post<Category>(
      "/items/category",
      { name: categoryName }, // 필드 이름 수정
      {
        headers: getAuthHeaders('Bearer'),
      }
    );
    return {
      id: Number(response.data.id),
      name: response.data.name,
    };
  } catch (error: any) {
    throw handleApiError(error, "카테고리 생성 중 오류 발생");
  }
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
  try {
    await api.delete(`/items/category/${categoryId}`, {
      headers: getAuthHeaders('Bearer'),
    });
  } catch (error: any) {
    throw handleApiError(error, "카테고리 삭제 중 오류 발생");
  }
};

// 보관 방법 관련 API
export const fetchStorageMethods = async (): Promise<StorageMethod[]> => {
  try {
    const response = await api.get<StorageMethod[]>("/items/storage-methods", {
      headers: getAuthHeaders('Bearer'),
    });
    return response.data.map((data) => ({
      id: Number(data.id), // 타입 변환
      name: data.name, // 적절한 필드 참조
    }));
  } catch (error: any) {
    throw handleApiError(error, "보관 방법 데이터를 불러오는 중 오류 발생");
  }
};

export const createStorageMethod = async (methodName: string): Promise<StorageMethod> => {
  try {
    const response = await api.post<StorageMethod>(
      "/items/storage-method",
      { name: methodName }, // 필드 이름 수정
      {
        headers: getAuthHeaders('Bearer'),
      }
    );
    return {
      id: Number(response.data.id),
      name: response.data.name,
    };
  } catch (error: any) {
    throw handleApiError(error, "보관 방법 생성 중 오류 발생");
  }
};

export const deleteStorageMethod = async (methodId: number): Promise<void> => {
  try {
    await api.delete(`/items/storage-method/${methodId}`, {
      headers: getAuthHeaders('Bearer'),
    });
  } catch (error: any) {
    throw handleApiError(error, "보관 방법 삭제 중 오류 발생");
  }
};

// 식재료 관련 API
export const fetchItems = async (): Promise<Item[]> => {
  try {
    const response = await api.get<Item[]>("/items", {
      headers: getAuthHeaders('Bearer'),
    });
    return response.data.map((data) => ({
      id: Number(data.id), // 타입 변환
      name: data.name,
      category: {
        id: Number(data.category?.id || 0), // 타입 변환 및 Optional 처리
        name: data.category?.name || '',
      },
      storageMethod: {
        id: Number(data.storageMethod?.id || 0), // 타입 변환 및 Optional 처리
        name: data.storageMethod?.name || '',
      },
    }));
  } catch (error: any) {
    throw handleApiError(error, "식재료 데이터를 불러오는 중 오류 발생");
  }
};

export const createItem = async (item: Partial<Item>): Promise<Item> => {
  try {
    const response = await api.post<Item>(
      "/items/item",
      item,
      {
        headers: getAuthHeaders('Bearer'),
      }
    );
    return {
      id: Number(response.data.id),
      name: response.data.name,
      category: {
        id: Number(response.data.category?.id || 0),
        name: response.data.category?.name || '',
      },
      storageMethod: {
        id: Number(response.data.storageMethod?.id || 0),
        name: response.data.storageMethod?.name || '',
      },
    };
  } catch (error: any) {
    throw handleApiError(error, "식재료 생성 중 오류 발생");
  }
};

export const deleteItem = async (itemId: number): Promise<void> => {
  try {
    await api.delete(`/items/${itemId}`, {
      headers: getAuthHeaders('Bearer'),
    });
  } catch (error: any) {
    throw handleApiError(error, "식재료 삭제 중 오류 발생");
  }
};
