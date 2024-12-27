// src/pages/ItemManagement.tsx

import React from "react";
import { Container } from "react-bootstrap";
import { useAdminContext } from "../contexts/AdminContext";
import AdminNavBar from "../components/organisms/AdminNavBar";
import LoadingModal from "../components/organisms/LoadingModal";
import IngredientForm from "../features/Admin/IngredientForm";
import IngredientTable from "../features/Admin/IngredientTable";

const ItemManagement: React.FC = () => {
  const { categories, storageMethods, items, loading, error, addItem, deleteItem } = useAdminContext();

  const handleAddItem = (item: { itemName: string; categoryName: string; storageMethodName: string; sellByDays: string | number; useByDays: string | number; }) => {
    const category = categories.find(cat => cat.name === item.categoryName);
    const storageMethod = storageMethods.find(method => method.name === item.storageMethodName);

    if (!category || !storageMethod) {
      console.error("Invalid category or storage method");
      return;
    }

    addItem({
      name: item.itemName,
      category,
      storageMethod,
    });
  };

  const handleRemoveItem = (id: string) => {
    const itemId = Number(id);
    if (!isNaN(itemId)) {
      deleteItem(itemId);
    }
  };

  return (
    <>
      <AdminNavBar />
      {loading && <LoadingModal />}
      <Container className="mt-4">
        <h3>식재료 관리</h3>
        <IngredientForm
          categories={categories.map((cat) => ({ categoryName: cat.name }))}
          storageMethods={storageMethods.map((method) => ({ storageMethodName: method.name }))}
          onAddItem={handleAddItem}
        />
        {error && <p className="text-danger">{error}</p>}
        {!loading && (
          <IngredientTable
            items={items.map((item) => ({
              id: item.id.toString(), // id 추가 및 변환
              itemName: item.name,
              categoryName: item.category?.name || "",
              storageMethodName: item.storageMethod?.name || "",
            }))}
            onRemoveItem={handleRemoveItem}
          />
        )}
      </Container>
    </>
  );
};

export default ItemManagement;
