// src/hooks/useStorageMethod.ts

import useResource from "./useResource";
import { fetchStorageMethods, createStorageMethod, deleteStorageMethod } from "../services/AdminApi";
import { StorageMethod } from "../types/EntityTypes";

const useStorageMethod = () => {
  return useResource<StorageMethod>(
    fetchStorageMethods,
    async (method: Omit<StorageMethod, "id">) => {
      const newMethod = await createStorageMethod(method.name);
      return { id: newMethod.id, name: newMethod.name };
    },
    deleteStorageMethod
  );
};

export default useStorageMethod;
