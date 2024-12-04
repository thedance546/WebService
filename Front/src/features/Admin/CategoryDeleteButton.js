// src/features/Admin/CategoryDeleteButton.js
import React from 'react';
import Button from '../../components/atoms/Button';
import { deleteCategory } from '../../services/AdminApi';

const CategoryDeleteButton = ({ categoryId, onDeleteSuccess }) => {
  const handleDelete = async () => {
    try {
      await deleteCategory(categoryId);
      onDeleteSuccess(categoryId);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Button onClick={handleDelete} className="btn btn-danger btn-sm">
      삭제
    </Button>
  );
};

export default CategoryDeleteButton;
