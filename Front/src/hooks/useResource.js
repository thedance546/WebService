// src/hooks/useResource.js
import { useState, useEffect, useCallback } from "react";

const useResource = (fetchFn, createFn, deleteFn) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shouldFetch, setShouldFetch] = useState(true);

  const getResources = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchFn();
      setResources(data);
      setError("");
    } catch (e) {
      setError("데이터를 불러오는 중 오류 발생");
    } finally {
      setLoading(false);
      setShouldFetch(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    if (shouldFetch) getResources();
  }, [shouldFetch, getResources]);

  const addResource = async (resource) => {
    try {
      const newResource = await createFn(resource);
      setResources((prev) => [...prev, newResource]);
      setShouldFetch(true);
    } catch (e) {
      setError("생성 중 오류 발생");
    }
  };

  const removeResource = async (id) => {
    try {
      await deleteFn(id);
      setResources((prev) => prev.filter((res) => res.id !== id));
      setShouldFetch(true);
    } catch (e) {
      setError("삭제 중 오류 발생");
    }
  };

  return { resources, loading, error, addResource, removeResource };
};

export default useResource;
