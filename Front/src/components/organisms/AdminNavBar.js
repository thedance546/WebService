// src/components/organisms/AdminNavBar.js
import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavList from '../molecules/NavList';
import LogoutButton from '../molecules/LogoutButton';
import { navItems } from '../../constants/adminNavItems';

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
          <NavList items={navItems} />
          <LogoutButton className="btn-sm mx-2" />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavBar;
