// src/hooks/useCategory.js
import { useState, useEffect, useCallback } from 'react';
import { fetchCategories, createCategory, deleteCategory } from '../services/AdminApi';

const useCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shouldFetch, setShouldFetch] = useState(true); // 데이터 갱신 여부를 관리하는 상태

  // 데이터 조회 함수
  const getCategories = useCallback(async () => {
    setLoading(true);
    try {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
      setError("");
    } catch (error) {
      setError("카테고리 데이터를 불러오는 중 오류 발생");
    } finally {
      setLoading(false);
      setShouldFetch(false); // 조회 후에 재조회 필요없음을 설정
    }
  }, []);

  // 컴포넌트가 마운트되거나 데이터가 갱신되면 조회
  useEffect(() => {
    if (shouldFetch) {
      getCategories();
    }
  }, [shouldFetch, getCategories]);

  // 카테고리 추가
  const addCategory = async (categoryName) => {
    try {
      const newCategory = await createCategory(categoryName);
      setCategories(prevCategories => [...prevCategories, newCategory]);
      setShouldFetch(true); // 새로운 카테고리 추가 시 데이터 갱신 필요
    } catch (error) {
      setError("카테고리 생성 중 오류 발생");
    }
  };

  // 카테고리 삭제
  const removeCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      setCategories(prevCategories => prevCategories.filter(category => category.id !== categoryId));
      setShouldFetch(true); // 카테고리 삭제 시 데이터 갱신 필요
    } catch (error) {
      setError("카테고리 삭제 중 오류 발생");
    }
  };

  return { categories, loading, error, addCategory, removeCategory };
};

export default useCategory;
