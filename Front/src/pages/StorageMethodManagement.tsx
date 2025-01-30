// src/pages/StorageMethodManagement.tsx

import React, { useState, useEffect } from 'react';
import { useAdminContext } from '../contexts/AdminContext';
import { Container, Form, Button, Table } from 'react-bootstrap';
import AdminNavBar from '../features/Admin/AdminNavBar';

const StorageMethodManagement: React.FC = () => {
  const { storageMethods, addStorageMethod, deleteStorageMethod, fetchStorageMethods, loading, error } =
    useAdminContext();
  const [newStorageMethodName, setNewStorageMethodName] = useState<string>("");

  useEffect(() => {
    fetchStorageMethods();
  }, [fetchStorageMethods]);

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newStorageMethodName.trim()) {
      return;
    }
    await addStorageMethod(newStorageMethodName);
    setNewStorageMethodName("");
  };

  const handleDelete = async (id: number) => {
    await deleteStorageMethod(id);
  };

  return (
    <>
      <AdminNavBar />
      <Container className="admin-content">
        <h3>보관 방법 관리</h3>
        {loading && <p>로딩 중...</p>}
        {error && <p className="text-danger">{error}</p>}
        <Form onSubmit={handleAdd} className="mb-3">
          <Form.Group>
            <Form.Label>보관 방법 이름</Form.Label>
            <Form.Control
              type="text"
              value={newStorageMethodName}
              onChange={(e) => setNewStorageMethodName(e.target.value)}
              placeholder="새 보관 방법 이름"
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
              <th>보관 방법 이름</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {storageMethods.map((method) => (
              <tr key={method.id}>
                <td>{method.id}</td>
                <td>{method.storageMethodName}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => method.id !== undefined && handleDelete(method.id)} // undefined 검증 추가
                  >
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

export default StorageMethodManagement;
