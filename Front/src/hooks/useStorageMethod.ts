// src/hooks/useStorageMethod.ts

import useResource from "./useResource";
import { fetchStorageMethods, createStorageMethod, deleteStorageMethod } from "../services/AdminApi";

export interface StorageMethod {
  id: string;
  storageMethodName: string;
}

const useStorageMethod = () =>
  useResource<StorageMethod>(fetchStorageMethods, createStorageMethod, deleteStorageMethod);

export default useStorageMethod;
