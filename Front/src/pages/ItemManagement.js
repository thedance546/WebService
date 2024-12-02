// src/pages/ItemManagement.js
import React, { useState, useEffect } from "react";
import { Container, Form, Button, Table } from "react-bootstrap";
import api from "../services/Api";
import AdminNavBar from "../components/organisms/AdminNavBar";

function ItemManagement() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get("/items");
        setItems(response.data);
      } catch (error) {
        console.error("식재료 데이터를 불러오는 중 오류 발생:", error);
      }
    };
    fetchItems();
  }, []);

  return (
    <>
      <AdminNavBar />
      <Container className="mt-4">
        <h3>식재료 관리</h3>
        <Form className="mb-3">
          <Form.Group>
            <Form.Label>식재료 이름</Form.Label>
            <Form.Control type="text" placeholder="식재료 이름 입력" />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-2">등록</Button>
        </Form>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>카테고리</th>
              <th>보관방법</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.itemName}</td>
                <td>{item.category.categoryName}</td>
                <td>{item.storageMethod.storageMethodName}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export default ItemManagement;