// src/pages/ItemManagement.tsx

import React from "react";
import { Container } from "react-bootstrap";
import useItem from "../hooks/useItem";
import { useAdminContext } from "../contexts/AdminContext";
import AdminNavBar from "../components/organisms/AdminNavBar";
import LoadingModal from "../components/organisms/LoadingModal";
import IngredientForm from "../features/Admin/IngredientForm";
import IngredientTable from "../features/Admin/IngredientTable";

const ItemManagement: React.FC = () => {
  const { categories, storageMethods } = useAdminContext();
  const { items, loading, error, addItem, removeItem } = useItem();

  return (
    <>
      <AdminNavBar />
      {loading && <LoadingModal />}
      <Container className="mt-4">
        <h3>식재료 관리</h3>
        <IngredientForm
          categories={categories}
          storageMethods={storageMethods}
          onAddItem={addItem}
        />
        {error && <p className="text-danger">{error}</p>}
        {!loading && (
          <IngredientTable items={items} onRemoveItem={removeItem} />
        )}
      </Container>
    </>
  );
};

export default ItemManagement;
