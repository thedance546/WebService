// src/pages/AdminPage.tsx

import React from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import AdminNavBar from "../features/Admin/AdminNavBar";
import { useAdminContext } from "../contexts/AdminContext";
import LoadingModal from "../components/organisms/LoadingModal";

const AdminPage: React.FC = () => {
  const { categories, storageMethods, ingredients, loading, error } = useAdminContext();

  return (
    <>
      <AdminNavBar />
      {loading && <LoadingModal />}
      <Container className="admin-content">
        <h2>Admin Dashboard</h2>
        {error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <Row className="mt-4">
            <Col md={4}>
              <h4>식재료 테이블</h4>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>이름</th>
                    <th>카테고리</th>
                    <th>보관방법</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredients.map((ingredient) => (
                    <tr key={ingredient.ingredientId}>
                      <td>{ingredient.name}</td>
                      <td>{ingredient.categoryId}</td>
                      <td>{ingredient.storageMethodId}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
            <Col md={4}>
              <h4>카테고리 테이블</h4>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>카테고리 이름</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
            <Col md={4}>
              <h4>보관 방법 테이블</h4>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>보관 방법 이름</th>
                  </tr>
                </thead>
                <tbody>
                  {storageMethods.map((method) => (
                    <tr key={method.id}>
                      <td>{method.name}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default AdminPage;
