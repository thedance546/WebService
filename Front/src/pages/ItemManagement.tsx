// src/pages/ItemManagement.tsx

import React from 'react';
import { Container } from 'react-bootstrap';
import { useAdminContext } from '../contexts/AdminContext';
import AdminNavBar from '../features/Admin/AdminNavBar';
import LoadingModal from '../components/organisms/LoadingModal';
import ItempInputForm from '../features/Admin/ItemInputForm';
import ItemTable from '../features/Admin/ItemTable';
import { Item } from '../types/EntityTypes';

const ItemManagement: React.FC = () => {
  const { categories, storageMethods, items, loading, error, addItem, deleteItem } = useAdminContext();

  const handleAddItem = (item: Item) => {
    addItem({
      id: item.id || 0,
      itemName: item.itemName,
      category: item.category || { id: 0, categoryName: "기본 카테고리" },
      storageMethod: item.storageMethod || { id: 0, storageMethodName: "기본 보관 방법" },
      shelfLife: item.shelfLife || { id: 0, sellByDays: 0, useByDays: 0 },
    });
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
        <ItempInputForm
          categories={categories}
          storageMethods={storageMethods}
          onAddItem={handleAddItem} // 타입 일치
        />
        {error && <p className="text-danger">{error}</p>}
        {!loading && (
          <ItemTable
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
