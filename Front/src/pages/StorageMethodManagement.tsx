// src/pages/StorageMethodManagement.tsx

import React, { useState } from 'react';
import { useAdminContext } from '../contexts/AdminContext';
import { Container, Form, Button, Table } from 'react-bootstrap';
import AdminNavBar from '../features/Admin/AdminNavBar';

const StorageMethodManagement: React.FC = () => {
  const { storageMethods, handleAddStorageMethod, handleDeleteStorageMethod } = useAdminContext();
  const [newStorageMethodName, setNewStorageMethodName] = useState<string>("");

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newStorageMethodName.trim()) {
      alert("보관 방법 이름을 입력해 주세요.");
      return;
    }
    handleAddStorageMethod(newStorageMethodName);
    setNewStorageMethodName("");
  };

  return (
    <>
      <AdminNavBar />
      <Container className="mt-4">
        <h3>보관 방법 관리</h3>
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
                <td>{method.name}</td> {/* storageMethodName -> name */}
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteStorageMethod(method.id)}
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
