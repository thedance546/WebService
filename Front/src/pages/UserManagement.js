// src/pages/UserManagement.js
import React, { useState, useEffect } from 'react';
import UserManagementTable from '../features/Admin/UserManagementTable';
import AdminNavBar from "../components/organisms/AdminNavBar";
//import api from "../services/AuthApi";

function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // const fetchUsers = async () => {
    //   try {
    //     const response = await api.get('/users');
    //     setUsers(response.data);
    //   } catch (error) {
    //     console.error("유저 데이터를 불러오는 중 오류 발생:", error);
    //   }
    // };
    // fetchUsers();
  }, []);

  const handleDeleteUser = (userId) => {
    // 유저 삭제 로직 추가 (API 호출 등)
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <>
      <AdminNavBar />
      <div className="container mt-4">
        <h3>유저 관리</h3>
        <UserManagementTable users={users} onDeleteUser={handleDeleteUser} />
      </div>
    </>
  );
}

export default UserManagement;
