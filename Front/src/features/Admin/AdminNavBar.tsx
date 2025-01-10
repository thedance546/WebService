// src/features/Admin/AdminNavBar.tsx
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../../components/molecules/LogoutButton';
import { navItems } from '../../constants/AdminNavItems';

const AdminNavBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Navbar id="admin-navbar" bg="dark" variant="dark" className="shadow fixed-top">
      <Container fluid className="d-flex justify-content-between align-items-center">
        <Navbar.Brand onClick={() => navigate('/admin')} className="text-white cursor-pointer">
          관리자 대시보드
        </Navbar.Brand>
        <Nav className="d-flex flex-row">
          {navItems.map((item) => (
            <Nav.Link
              key={item.path}
              className="text-white px-3"
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </Nav.Link>
          ))}
        </Nav>
        <div className="ms-auto">
          <LogoutButton className="btn-sm" />
        </div>
      </Container>
    </Navbar>
  );
};

export default AdminNavBar;
