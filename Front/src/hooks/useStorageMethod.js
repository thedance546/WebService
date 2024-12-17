// src/hooks/useStorageMethod.js
import useResource from "./useResource";
import { fetchStorageMethods, createStorageMethod, deleteStorageMethod } from "../services/AdminApi";

const useStorageMethod = () => useResource(fetchStorageMethods, createStorageMethod, deleteStorageMethod);

export default useStorageMethod;
