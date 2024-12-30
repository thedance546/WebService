// src/components/organisms/AdminNavBar.tsx

import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavList from '../molecules/NavList';
import LogoutButton from '../molecules/LogoutButton';
import { navItems } from '../../constants/adminNavItems';

const AdminNavBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand onClick={() => navigate('/admin')} className="cursor-pointer text-white">
          관리자 대시보드
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="admin-navbar-nav" />
        <Navbar.Collapse id="admin-navbar-nav" className="d-flex justify-content-between align-items-center">
          <NavList items={navItems} className="d-flex flex-row align-items-center" />
          <div>
            <LogoutButton className="btn btn-warning text-nowrap" />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavBar;
