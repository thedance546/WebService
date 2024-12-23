// src/hooks/useItem.ts

import useResource, { ResourceHook } from "./useResource";
import { fetchItems, createItem, deleteItem } from "../services/AdminApi";
import { Item, Category, StorageMethod } from "../types/EntityTypes";

const useItem = (): ResourceHook<Item> => {
  return useResource<Item>(
    fetchItems,
    async (item: Omit<Item, "id">): Promise<Item> => {
      const newItem = await createItem(item);
      return {
        id: newItem.id,
        name: newItem.name,
        category: newItem.category || { id: 0, name: "" },
        storageMethod: newItem.storageMethod || { id: 0, name: "" },
      };
    },
    deleteItem
  );
};

export default useItem;
