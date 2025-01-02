import React from 'react';
import { Container } from 'react-bootstrap';
import { useAdminContext } from '../contexts/AdminContext';
import AdminNavBar from '../features/Admin/AdminNavBar';
import LoadingModal from '../components/organisms/LoadingModal';
import IngredientForm from '../features/Admin/IngredientForm';
import IngredientTable from '../features/Admin/IngredientTable';
import { Item } from '../types/EntityTypes';

const ItemManagement: React.FC = () => {
  const { categories, storageMethods, items, loading, error, addItem, deleteItem } = useAdminContext();

  const handleAddItem = (item: {
    name: string;
    categoryId: number;
    storageMethodId: number;
    sellByDays: string | number;
    useByDays: string | number;
  }) => {
    const category = categories.find((cat) => cat.id === item.categoryId);
    const storageMethod = storageMethods.find((method) => method.id === item.storageMethodId);

    if (!category || !storageMethod) {
      console.error("Invalid category or storage method");
      return;
    }

    addItem({
      id: 0, // 임시 ID
      name: item.name,
      category,
      storageMethod,
    } as Item);
  };


  const handleDeleteItem = (id: number) => {
    deleteItem(id);
  };

  return (
    <>
      <AdminNavBar />
      {loading && <LoadingModal />}
      <Container className="admin-content">
        <h3>아이템 관리</h3>
        <IngredientForm
          categories={categories}
          storageMethods={storageMethods}
          onAddItem={handleAddItem} // 타입 일치
        />
        {error && <p className="text-danger">{error}</p>}
        {!loading && (
          <IngredientTable
            items={items.map((item) => ({
              ...item,
              categoryName: item.category?.categoryName || "N/A",
              storageMethodName: item.storageMethod?.storageMethodName || "N/A",
            }))}
            onDeleteItem={handleDeleteItem} // number 타입의 ID 사용
          />
        )}
      </Container>
    </>
  );
};

export default ItemManagement;
