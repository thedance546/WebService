// src/pages/ItemManagement.js
import React, { useState } from "react";
import { Container, Form, Button, Table } from "react-bootstrap";
import useItem from "../hooks/useItem";
import { useAdminContext } from "../contexts/AdminContext";
import AdminNavBar from "../components/organisms/AdminNavBar";
import LoadingModal from "../components/organisms/LoadingModal";

function ItemManagement() {
  const { categories, storageMethods } = useAdminContext(); // 카테고리 및 보관 방법을 가져옴
  const { items, loading, error, addItem, removeItem } = useItem(); // 식재료 데이터를 가져옴
  const [newItemName, setNewItemName] = useState("");
  const [sellByDays, setSellByDays] = useState("");
  const [useByDays, setUseByDays] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [storageMethodName, setStorageMethodName] = useState("");

  // 식재료 추가 핸들러
  const handleAddItem = async (event) => {
    event.preventDefault();
    if (!newItemName || !categoryName || !storageMethodName) {
      alert("모든 필드를 입력해 주세요.");
      return;
    }

    const newItem = {
      itemName: newItemName,
      category: { categoryName },
      storageMethod: { storageMethodName },
      shelfLife: { sellByDays, useByDays },
    };

    await addItem(newItem);
    setNewItemName("");
    setSellByDays("");
    setUseByDays("");
    setCategoryName("");
    setStorageMethodName("");
    console.log(newItem);
  };

  return (
    <>
      <AdminNavBar />
      {loading && <LoadingModal />}
      <Container className="mt-4">
        <h3>식재료 관리</h3>
        <Form onSubmit={handleAddItem} className="mb-3">
          <Form.Group>
            <Form.Label>식재료 이름</Form.Label>
            <Form.Control
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="식재료 이름"
            />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>유통기한 (일)</Form.Label>
            <Form.Control
              type="number"
              value={sellByDays}
              onChange={(e) => setSellByDays(e.target.value)}
              placeholder="유통기한"
            />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>소비기한 (일)</Form.Label>
            <Form.Control
              type="number"
              value={useByDays}
              onChange={(e) => setUseByDays(e.target.value)}
              placeholder="소비기한"
            />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>카테고리</Form.Label>
            <Form.Select
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            >
              <option value="">카테고리를 선택하세요</option>
              {categories.map((category) => (
                <option key={category.id} value={category.categoryName}>
                  {category.categoryName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>보관 방법</Form.Label>
            <Form.Select
              value={storageMethodName}
              onChange={(e) => setStorageMethodName(e.target.value)}
            >
              <option value="">보관 방법을 선택하세요</option>
              {storageMethods.map((method) => (
                <option key={method.id} value={method.storageMethodName}>
                  {method.storageMethodName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            식재료 추가
          </Button>
        </Form>

        {error && <p className="text-danger">{error}</p>}

        {!loading && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>이름</th>
                <th>카테고리</th>
                <th>보관방법</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.itemName}</td>
                  <td>{item.category?.categoryName}</td>
                  <td>{item.storageMethod?.storageMethodName}</td>
                  <td>
                    <Button variant="danger" onClick={() => removeItem(item.id)}>
                      삭제
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </>
  );
}

export default ItemManagement;
