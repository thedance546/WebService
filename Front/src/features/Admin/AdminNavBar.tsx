// src/components/organisms/AdminNavBar.tsx
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../../components/molecules/LogoutButton';
import { navItems } from '../../constants/adminNavItems';

const AdminNavBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" variant="dark" className="fixed-top">
      <Container fluid className="d-flex justify-content-between align-items-center">
        <Navbar.Brand
          onClick={() => navigate('/admin')}
          className="cursor-pointer text-white"
        >
          관리자 대시보드
        </Navbar.Brand>
        <Nav className="d-flex flex-row">
          {navItems.map(({ path, label }) => (
            <Nav.Link
              key={path}
              onClick={() => navigate(path)}
              className="text-white text-decoration-none px-3 text-nowrap"
            >
              {label}
            </Nav.Link>
          ))}
        </Nav>
        <LogoutButton className="btn-sm" />
      </Container>
    </Navbar>
  );
};

export default AdminNavBar;
