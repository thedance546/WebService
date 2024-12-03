// src/components/organisms/CategoryTable.js
import React from 'react';
import { Table } from 'react-bootstrap';
import CategoryDeleteButton from './CategoryDeleteButton';

const CategoryTable = ({ categories, onDelete }) => (
  <Table striped bordered hover>
    <thead>
      <tr>
        <th>ID</th>
        <th>카테고리 이름</th>
        <th>액션</th>
      </tr>
    </thead>
    <tbody>
      {categories.map((category) => (
        <tr key={category.id}>
          <td>{category.id}</td>
          <td>{category.categoryName}</td>
          <td>
            <CategoryDeleteButton categoryId={category.id} onDeleteSuccess={onDelete} />
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default CategoryTable;
