// src/hooks/useItem.js
import { useState, useEffect, useCallback } from 'react';
import { fetchItems, createItem, deleteItem } from '../services/AdminApi';

const useItem = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shouldFetch, setShouldFetch] = useState(true);

  // 데이터 조회 함수
  const getItems = useCallback(async () => {
    setLoading(true);
    try {
      const itemsData = await fetchItems();
      setItems(itemsData);
      setError("");
    } catch (error) {
      setError("식재료 데이터를 불러오는 중 오류 발생");
    } finally {
      setLoading(false);
      setShouldFetch(false);
    }
  }, []);

  // 컴포넌트가 마운트되거나 데이터가 갱신되면 조회
  useEffect(() => {
    if (shouldFetch) {
      getItems();
    }
  }, [shouldFetch, getItems]);

  // 식재료 추가
  const addItem = async (item) => {
    try {
      const newItem = await createItem(item);
      setItems(prevItems => [...prevItems, newItem]);
      setShouldFetch(true);
    } catch (error) {
      setError("식재료 생성 중 오류 발생");
    }
  };

  // 식재료 삭제
  const removeItem = async (itemId) => {
    try {
      await deleteItem(itemId);
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
      setShouldFetch(true);
    } catch (error) {
      setError("식재료 삭제 중 오류 발생");
    }
  };

  return { items, loading, error, addItem, removeItem };
};

export default useItem;
