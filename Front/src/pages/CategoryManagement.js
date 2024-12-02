// src/pages/CategoryManagement.js
import React, { useState, useEffect } from "react";
import { Container, Form, Button, Table } from "react-bootstrap";
import api from "../services/Api";
import AdminNavBar from "../components/organisms/AdminNavBar";

function CategoryManagement() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/items/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("카테고리 데이터를 불러오는 중 오류 발생:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <AdminNavBar />
      <Container className="mt-4">
        <h3>카테고리 관리</h3>
        <Form className="mb-3">
          <Form.Group>
            <Form.Label>카테고리 이름</Form.Label>
            <Form.Control type="text" placeholder="카테고리 이름 입력" />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-2">등록</Button>
        </Form>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>카테고리 이름</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.categoryName}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export default CategoryManagement;