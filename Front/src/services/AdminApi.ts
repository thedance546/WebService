// src/services/AdminApi.ts

import { api, getAuthHeaders } from './Api';
import { handleApiError } from '../utils/Utils';
import { Category, StorageMethod, Item } from '../types/EntityTypes';

// 카테고리 관련 API
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    console.log("카테고리 데이터 요청 시작");
    const response = await api.get<Category[]>('/items/categories', {
      headers: getAuthHeaders('Bearer'),
    });
    console.log("카테고리 데이터 로드 성공:", response.data);
    return response.data.map((data: any) => ({
      id: Number(data.id),
      categoryName: data.categoryName,
    }));
  } catch (error: any) {
    throw handleApiError(error, '카테고리 데이터를 불러오는 중 오류 발생');
  }
};

export const createCategory = async (categoryName: string): Promise<Category> => {
  try {
    console.log("Authorization Header (Category):", getAuthHeaders("Bearer"));
    const response = await api.post<Category>(
      "/items/category",
      { categoryName: categoryName },
      {
        headers: getAuthHeaders("Bearer"),
      }
    );
    return {
      id: Number(response.data.id),
      categoryName: response.data.categoryName,
    };
  } catch (error: any) {
    console.error("Error creating category:", error.response || error);
    throw handleApiError(error, "카테고리 생성 중 오류 발생");
  }
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
  try {
    await api.delete(`/items/category/${categoryId}`, {
      headers: getAuthHeaders('Bearer'),
    });
  } catch (error: any) {
    throw handleApiError(error, '카테고리 삭제 중 오류 발생');
  }
};

// 보관 방법 관련 API
export const fetchStorageMethods = async (): Promise<StorageMethod[]> => {
  try {
    console.log("저장방법 데이터 요청 시작");
    const response = await api.get<StorageMethod[]>('/items/storage-methods', {
      headers: getAuthHeaders('Bearer'),
    });
    console.log("저장방법 데이터 로드 성공:", response.data);
    return response.data.map((data: any) => ({
      id: Number(data.id),
      storageMethodName: data.storageMethodName,
    }));
  } catch (error: any) {
    throw handleApiError(error, '보관 방법 데이터를 불러오는 중 오류 발생');
  }
};

export const createStorageMethod = async (methodName: string): Promise<StorageMethod> => {
  try {
    console.log("Authorization Header (Storage Method):", getAuthHeaders("Bearer"));
    const response = await api.post<StorageMethod>(
      "/items/storage-method",
      { storageMethodName: methodName },
      {
        headers: getAuthHeaders("Bearer"),
      }
    );
    return {
      id: Number(response.data.id),
      storageMethodName: response.data.storageMethodName,
    };
  } catch (error: any) {
    console.error("Error creating storage method:", error.response || error);
    throw handleApiError(error, "보관 방법 생성 중 오류 발생");
  }
};

export const deleteStorageMethod = async (methodId: number): Promise<void> => {
  try {
    await api.delete(`/items/storage-method/${methodId}`, {
      headers: getAuthHeaders('Bearer'),
    });
  } catch (error: any) {
    throw handleApiError(error, '보관 방법 삭제 중 오류 발생');
  }
};

// 식재료 관련 API
export const fetchItems = async (): Promise<Item[]> => {
  try {
    console.log("아이템 데이터 요청 시작");
    const response = await api.get('/items', {
      headers: getAuthHeaders('Bearer'),
    });
    console.log("아이템 데이터 로드 성공:", response.data);

    return response.data.map((data: any): Item => ({
      id: data.id,
      name: data.name,
      category: data.category ? { id: data.category.id, categoryName: data.category.categoryName } : undefined,
      storageMethod: data.storageMethod
        ? { id: data.storageMethod.id, storageMethodName: data.storageMethod.storageMethodName }
        : undefined,
    }));
  } catch (error: any) {
    throw handleApiError(error, '아이템 데이터를 불러오는 중 오류 발생');
  }
};

export const createItem = async (item: Partial<Item>): Promise<Item> => {
  try {
    const response = await api.post(
      '/items/item',
      {
        name: item.name,
        categoryId: item.category?.id,
        storageMethodId: item.storageMethod?.id,
      },
      {
        headers: getAuthHeaders('Bearer'),
      },
    );

    return {
      id: response.data.id,
      name: response.data.name,
      category: response.data.category ? { id: response.data.category.id, categoryName: response.data.category.categoryName } : undefined,
      storageMethod: response.data.storageMethod
        ? { id: response.data.storageMethod.id, storageMethodName: response.data.storageMethod.storageMethodName }
        : undefined,
    };
  } catch (error: any) {
    throw handleApiError(error, '아이템 생성 중 오류 발생');
  }
};

export const deleteItem = async (itemId: number): Promise<void> => {
  try {
    await api.delete(`/items/${itemId}`, {
      headers: getAuthHeaders('Bearer'),
    });
  } catch (error: any) {
    throw handleApiError(error, '아이템 삭제 중 오류 발생');
  }
};
