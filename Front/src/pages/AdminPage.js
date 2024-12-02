// src/pages/AdminPage.js
import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../components/organisms/AdminNavBar";

function AdminPage() {
  const navigate = useNavigate();

  const goToPage = (path) => {
    navigate(path);
  };

  return (
    <>
      <AdminNavBar />
      <Container className="mt-4">
        <h2>Admin Dashboard</h2>
        <Row className="mt-4">
          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title>식재료 관리</Card.Title>
                <Card.Text>총 식재료 수: 120</Card.Text>
                <Button variant="primary" onClick={() => goToPage("/admin/items")}>관리 페이지로 이동</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title>유저 관리</Card.Title>
                <Card.Text>총 유저 수: 50</Card.Text>
                <Button variant="primary" onClick={() => goToPage("/admin/users")}>관리 페이지로 이동</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title>카테고리 관리</Card.Title>
                <Card.Text>등록된 카테고리 수: 10</Card.Text>
                <Button variant="primary" onClick={() => goToPage("/admin/categories")}>관리 페이지로 이동</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title>보관방법 관리</Card.Title>
                <Card.Text>등록된 보관방법 수: 5</Card.Text>
                <Button variant="primary" onClick={() => goToPage("/admin/storage-method")}>관리 페이지로 이동</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default AdminPage;
