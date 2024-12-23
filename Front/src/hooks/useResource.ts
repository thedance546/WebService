// src/hooks/useResource.ts

import { useState, useEffect, useCallback } from "react";

interface ResourceHook<T> {
  resources: T[];
  loading: boolean;
  error: string;
  addResource: (resource: T) => Promise<void>;
  removeResource: (id: string) => Promise<void>;
}

const useResource = <T>(
  fetchFn: () => Promise<T[]>,
  createFn: (resource: T) => Promise<T>,
  deleteFn: (id: string) => Promise<void>
): ResourceHook<T> => {
  const [resources, setResources] = useState<T[]>([]);
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

  const addResource = async (resource: T) => {
    try {
      const newResource = await createFn(resource);
      setResources((prev) => [...prev, newResource]);
      setShouldFetch(true);
    } catch (e) {
      setError("생성 중 오류 발생");
    }
  };

  const removeResource = async (id: string) => {
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
