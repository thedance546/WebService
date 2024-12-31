import { api, getAuthHeaders } from './Api';
import { handleApiError } from '../utils/Utils';
import { Category, StorageMethod, Ingredient } from '../types/EntityTypes';

// 카테고리 관련 API
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get<Category[]>('/items/categories', {
      headers: getAuthHeaders('Bearer'),
    });
    return response.data.map((data: any) => ({
      id: Number(data.id),
      name: data.name,
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
      name: response.data.name,
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
    const response = await api.get<StorageMethod[]>('/items/storage-methods', {
      headers: getAuthHeaders('Bearer'),
    });
    return response.data.map((data: any) => ({
      id: Number(data.id),
      name: data.name,
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
      { storageMethodName: methodName }, // 수정된 부분
      {
        headers: getAuthHeaders("Bearer"),
      }
    );
    return {
      id: Number(response.data.id),
      name: response.data.name,
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
export const fetchIngredients = async (): Promise<Ingredient[]> => {
  try {
    const response = await api.get('/items', {
      headers: getAuthHeaders('Bearer'),
    });

    return response.data.map((data: any): Ingredient => ({
      ingredientId: data.id,
      name: data.name,
      categoryId: data.category?.id || 0,
      storageMethodId: data.storageMethod?.id || 0,
      quantity: data.quantity || 0,
    }));
  } catch (error: any) {
    throw handleApiError(error, '식재료 데이터를 불러오는 중 오류 발생');
  }
};

export const createIngredient = async (ingredient: Partial<Ingredient>): Promise<Ingredient> => {
  try {
    const response = await api.post(
      '/items/item',
      {
        name: ingredient.name,
        categoryId: ingredient.categoryId,
        storageMethodId: ingredient.storageMethodId,
        quantity: ingredient.quantity,
      },
      {
        headers: getAuthHeaders('Bearer'),
      },
    );

    return {
      ingredientId: response.data.id,
      name: response.data.name,
      categoryId: response.data.categoryId,
      storageMethodId: response.data.storageMethodId,
      quantity: response.data.quantity,
    };
  } catch (error: any) {
    throw handleApiError(error, '식재료 생성 중 오류 발생');
  }
};

export const deleteIngredient = async (ingredientId: number): Promise<void> => {
  try {
    await api.delete(`/items/${ingredientId}`, {
      headers: getAuthHeaders('Bearer'),
    });
  } catch (error: any) {
    throw handleApiError(error, '식재료 삭제 중 오류 발생');
  }
};
