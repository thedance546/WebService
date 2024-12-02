// src/components/organisms/AdminNavBar.js
import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavItem from '../atoms/NavItem';
import Button from '../atoms/Button';

const AdminNavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 로그아웃 로직을 추가하세요. 예를 들어, 토큰 삭제 후 로그인 페이지로 이동
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand onClick={() => navigate('/admin')} className="cursor-pointer">
          Admin Dashboard
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavItem path="/admin/items" label="식재료 관리" />
            <NavItem path="/admin/users" label="유저 관리" />
            <NavItem path="/admin/categories" label="카테고리 관리" />
            <NavItem path="/admin/storage-method" label="보관방법 관리" />
          </Nav>
          <Nav>
            <Button onClick={handleLogout} className="btn btn-warning">
              로그아웃
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavBar;
