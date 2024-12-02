// src/pages/StorageMethodManagement.js
import React, { useState, useEffect } from "react";
import { Container, Form, Button, Table } from "react-bootstrap";
import api from "../services/Api";
import AdminNavBar from "../components/organisms/AdminNavBar";

function StorageMethodManagement() {
  const [storageMethods, setStorageMethods] = useState([]);

  useEffect(() => {
    const fetchStorageMethods = async () => {
      try {
        const response = await api.get("/items/storage-methods");
        setStorageMethods(response.data);
      } catch (error) {
        console.error("보관방법 데이터를 불러오는 중 오류 발생:", error);
      }
    };
    fetchStorageMethods();
  }, []);

  return (
    <>
      <AdminNavBar />
      <Container className="mt-4">
        <h3>보관방법 관리</h3>
        <Form className="mb-3">
          <Form.Group>
            <Form.Label>보관방법 이름</Form.Label>
            <Form.Control type="text" placeholder="보관방법 이름 입력" />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-2">등록</Button>
        </Form>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>보관방법 이름</th>
            </tr>
          </thead>
          <tbody>
            {storageMethods.map((method) => (
              <tr key={method.id}>
                <td>{method.id}</td>
                <td>{method.storageMethodName}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export default StorageMethodManagement;