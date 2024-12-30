// src/pages/IngredientsManagement.tsx

import React from 'react';
import { Container } from 'react-bootstrap';
import { useAdminContext } from '../contexts/AdminContext';
import AdminNavBar from '../features/Admin/AdminNavBar';
import LoadingModal from '../components/organisms/LoadingModal';
import IngredientForm from '../features/Admin/IngredientForm';
import IngredientTable from '../features/Admin/IngredientTable';

const IngredientsManagement: React.FC = () => {
  const { categories, storageMethods, ingredients, loading, error, addIngredient, deleteIngredient } = useAdminContext();

  const handleAddIngredient = (ingredient: { name: string; categoryName: string; storageMethodName: string; sellByDays: string | number; useByDays: string | number; }) => {
    const category = categories.find(cat => cat.name === ingredient.categoryName);
    const storageMethod = storageMethods.find(method => method.name === ingredient.storageMethodName);

    if (!category || !storageMethod) {
      console.error("Invalid category or storage method");
      return;
    }

    addIngredient({
      name: ingredient.name,
      category,
      storageMethod,
    });
  };

  const handleDeleteIngredient = (id: string) => {
    const ingredientId = Number(id);
    if (!isNaN(ingredientId)) {
      deleteIngredient(ingredientId);
    }
  };

  return (
    <>
      <AdminNavBar />
      {loading && <LoadingModal />}
      <Container className="admin-content">
        <h3>식재료 관리</h3>
        <IngredientForm
          categories={categories.map((cat) => ({ categoryName: cat.name }))}
          storageMethods={storageMethods.map((method) => ({ storageMethodName: method.name }))}
          onAddIngredient={handleAddIngredient}
        />
        {error && <p className="text-danger">{error}</p>}
        {!loading && (
          <IngredientTable
            ingredients={ingredients.map((ingredient) => ({
              id: ingredient.id.toString(),
              name: ingredient.name,
              categoryName: ingredient.category?.name || "",
              storageMethodName: ingredient.storageMethod?.name || "",
            }))}
            onDeleteIngredient={handleDeleteIngredient}
          />
        )}
      </Container>
    </>
  );
};

export default IngredientsManagement;
