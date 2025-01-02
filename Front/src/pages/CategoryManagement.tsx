// src/pages/CategoryManagement.tsx

import React, { useState, useEffect } from 'react';
import { useAdminContext } from '../contexts/AdminContext';
import { Container, Form, Button, Table } from 'react-bootstrap';
import AdminNavBar from '../features/Admin/AdminNavBar';

const CategoryManagement: React.FC = () => {
  const { categories, addCategory, deleteCategory, fetchCategories, loading, error } = useAdminContext();
  const [newCategoryName, setNewCategoryName] = useState<string>("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newCategoryName.trim()) {
      return;
    }
    await addCategory(newCategoryName);
    setNewCategoryName("");
    await fetchCategories();
  };

  const handleDelete = async (id: number) => {
    await deleteCategory(id);
    await fetchCategories();
  };

  return (
    <>
      <AdminNavBar />
      <Container className="admin-content">
        <h3>카테고리 관리</h3>
        {loading && <p>로딩 중...</p>}
        {error && <p className="text-danger">{error}</p>}
        <Form onSubmit={handleAdd} className="mb-3">
          <Form.Group>
            <Form.Label>카테고리 이름</Form.Label>
            <Form.Control
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="새 카테고리 이름"
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            추가
          </Button>
        </Form>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>카테고리 이름</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.categoryName}</td>
                <td>
                  <Button variant="danger" onClick={() => handleDelete(category.id)}>
                    삭제
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default CategoryManagement;
