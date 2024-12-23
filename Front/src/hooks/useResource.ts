// src/hooks/useResource.ts

import { useState, useEffect, useCallback } from "react";

interface ResourceWithId {
  id: number; // id를 number로 제한
}

export interface ResourceHook<T extends { id: number }> {
  resources: T[];
  loading: boolean;
  error: string;
  addResource: (resource: Omit<T, "id">) => Promise<void>;
  removeResource: (id: number) => Promise<void>;
}

const useResource = <T extends ResourceWithId>(
  fetchFn: () => Promise<T[]>,
  createFn: (resource: Omit<T, "id">) => Promise<T>,
  deleteFn: (id: number) => Promise<void>
): ResourceHook<T> => {
  const [resources, setResources] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    }
  }, [fetchFn]);

  useEffect(() => {
    getResources();
  }, [getResources]);

  const addResource = async (resource: Omit<T, "id">) => {
    try {
      const newResource = await createFn(resource);
      setResources((prev) => [...prev, newResource]);
    } catch (e) {
      setError("생성 중 오류 발생");
    }
  };

  const removeResource = async (id: number) => {
    try {
      await deleteFn(id);
      setResources((prev) => prev.filter((res) => res.id !== id));
    } catch (e) {
      setError("삭제 중 오류 발생");
    }
  };

  return { resources, loading, error, addResource, removeResource };
};

export default useResource;
