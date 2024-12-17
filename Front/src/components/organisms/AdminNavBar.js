// src/components/organisms/AdminNavBar.js
import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavItem from '../atoms/NavItem';
import LogoutButton from '../molecules/LogoutButton';

const navItems = [
  { path: "/admin/items", label: "식재료" },
  { path: "/admin/users", label: "유저" },
  { path: "/admin/categories", label: "카테고리" },
  { path: "/admin/storage-method", label: "보관방법" },
];

const AdminNavBar = () => {
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm">
      <Container>
        <Navbar.Brand onClick={() => navigate('/admin')} className="cursor-pointer">
          관리자 대시보드
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {navItems.map((item) => (
              <NavItem key={item.path} path={item.path} label={item.label} />
            ))}
          </Nav>
          <Nav>
            <LogoutButton className="btn-sm mx-2" />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavBar;
