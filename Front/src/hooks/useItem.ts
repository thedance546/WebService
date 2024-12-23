// src/hooks/useItem.ts

import { useState, useEffect, useCallback } from 'react';
import { fetchItems, createItem, deleteItem } from '../services/AdminApi';

export interface Item {
  id: string;
  name: string;
  category?: string;
  storageMethod?: string;
}

const useItem = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [shouldFetch, setShouldFetch] = useState<boolean>(true);

  const getItems = useCallback(async () => {
    setLoading(true);
    try {
      const itemsData = await fetchItems();
      const updatedItems = itemsData.map((item: Item) => ({
        ...item,
      }));
      setItems(updatedItems);
      setError("");
    } catch (error: any) {
      setError("식재료 데이터를 불러오는 중 오류 발생");
    } finally {
      setLoading(false);
      setShouldFetch(false);
    }
  }, []);

  useEffect(() => {
    if (shouldFetch) {
      getItems();
    }
  }, [shouldFetch, getItems]);

  const addItem = async (item: Item): Promise<void> => {
    try {
      const newItem = await createItem(item);
      setItems(prevItems => [...prevItems, newItem]);
      setShouldFetch(true);
    } catch (error: any) {
      setError("식재료 생성 중 오류 발생");
    }
  };

  const removeItem = async (itemId: string): Promise<void> => {
    try {
      await deleteItem(itemId);
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
      setShouldFetch(true);
    } catch (error: any) {
      setError("식재료 삭제 중 오류 발생");
    }
  };

  return { items, loading, error, addItem, removeItem };
};

export default useItem;
