// src/hooks/useStorageMethod.js
import { useState, useEffect, useCallback } from 'react';
import { fetchStorageMethods, createStorageMethod, deleteStorageMethod } from '../services/AdminApi';

const useStorageMethod = () => {
  const [storageMethods, setStorageMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shouldFetch, setShouldFetch] = useState(true);

  // 데이터 조회 함수
  const getStorageMethods = useCallback(async () => {
    setLoading(true);
    try {
      const methodsData = await fetchStorageMethods();
      setStorageMethods(methodsData);
      setError("");
    } catch (error) {
      setError("보관 방법 데이터를 불러오는 중 오류 발생");
    } finally {
      setLoading(false);
      setShouldFetch(false);
    }
  }, []);

  // 컴포넌트가 마운트되거나 데이터가 갱신되면 조회
  useEffect(() => {
    if (shouldFetch) {
      getStorageMethods();
    }
  }, [shouldFetch, getStorageMethods]);

  // 보관 방법 추가
  const addStorageMethod = async (methodName) => {
    try {
      const newMethod = await createStorageMethod(methodName);
      setStorageMethods(prevMethods => [...prevMethods, newMethod]);
      setShouldFetch(true);
    } catch (error) {
      setError("보관 방법 생성 중 오류 발생");
    }
  };

  // 보관 방법 삭제
  const removeStorageMethod = async (methodId) => {
    try {
      await deleteStorageMethod(methodId);
      setStorageMethods(prevMethods => prevMethods.filter(method => method.id !== methodId));
      setShouldFetch(true);
    } catch (error) {
      setError("보관 방법 삭제 중 오류 발생");
    }
  };

  return { storageMethods, loading, error, addStorageMethod, removeStorageMethod };
};

export default useStorageMethod;
